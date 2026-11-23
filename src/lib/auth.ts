import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

type MongoAdapterFactory = ReturnType<typeof mongodbAdapter>;
type MongoAdapterOptions = Parameters<MongoAdapterFactory>[0];

const client = new MongoClient(process.env.MONGODB_URI as string, {
  // Serverless-friendly: keep the pool small instead of the driver default (100),
  // and fail fast instead of holding a request for the 30s driver default.
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10_000,
});
const db = client.db('rental-platform');

const createMongoAdapter = mongodbAdapter(db, {
  client,
});

/**
 * If a MongoDB operation fails while the cluster is unreachable (e.g.
 * `MongoServerSelectionError` during a primary election), the driver leaves a
 * *closed* topology on the client. From then on every operation on this warm
 * serverless instance throws `MongoTopologyClosedError` until the client is
 * reconnected — which is what surfaces as
 * "not retried until the application restarts" on the Better Auth index creation.
 *
 * `MongoClient.connect()` builds a fresh topology when the current one is not
 * connected, and `db`/the adapter resolve the topology from the client on every
 * operation, so reconnecting in place keeps all existing references valid.
 *
 * Reconnects are **single-flight**: many concurrent requests share one
 * in-flight `connect()` instead of racing each other with their own.
 */
let reconnectPromise: Promise<void> | null = null;

async function reconnectMongo(): Promise<void> {
  if (!reconnectPromise) {
    reconnectPromise = (async () => {
      try {
        await client.connect();
        console.warn("[auth] MongoDB reconnected.");
      } catch (error) {
        console.error("[auth] MongoDB reconnect failed:", error);
      } finally {
        reconnectPromise = null;
      }
    })();
  }
  await reconnectPromise;
}

/** Reconnects *before* a query when the driver reports a closed topology. */
async function ensureMongoConnected(): Promise<void> {
  const topology = (client as unknown as {
    topology?: { isConnected?: () => boolean };
  }).topology;

  // No topology yet = the driver connects lazily on first use. If a previous
  // `close()`/fatal failure nulled it instead, the query itself throws
  // `MongoNotConnectedError`, which the retry path below already handles.
  if (!topology || typeof topology.isConnected !== "function") return;

  // Healthy. After a fatal failure the driver reports `false` — and on some
  // paths `undefined` — so only an explicit `true` counts as connected.
  if (topology.isConnected()) return;

  console.warn("[auth] MongoDB topology was closed after a failed operation — reconnecting.");
  await reconnectMongo();
}

/**
 * Errors the driver raises **before** a query reaches a server, so replaying
 * the same call after reconnecting is safe — including for writes. Network
 * errors *after* a query was sent are deliberately excluded (the outcome is
 * unknown and a blind retry could duplicate a write).
 */
const RETRYABLE_MONGO_ERRORS = new Set([
  "MongoTopologyClosedError",
  "MongoServerSelectionError",
  "MongoNotConnectedError",
]);

function isRetryableMongoError(error: unknown): boolean {
  const name = (error as { name?: string } | null)?.name;
  if (name && RETRYABLE_MONGO_ERRORS.has(name)) return true;
  const message = (error as { message?: string } | null)?.message ?? "";
  return /topology is closed|server selection timed out|client not connected/i.test(message);
}

/**
 * TEMPORARY fault-injection hook used to verify the self-healing path.
 * (Removed again after the verification run.)
 */
const TEMP_FAULT_SKIP = 0;
const TEMP_FAULT_COUNT = 0;
let tempFaultsSeen = 0;

/** Runs every Better Auth database call through `ensureMongoConnected()` first. */
function withSelfHealingMongo<T extends object>(adapter: T): T {
  return new Proxy(adapter, {
    get(target, property) {
      const value = Reflect.get(target, property);
      if (typeof value !== "function") return value;
      return async (...args: unknown[]) => {
        await ensureMongoConnected();

        // `value.apply` is what both the first attempt and the retry run, so a
        // temporary injected failure exercises the real retry path.
        const run = (...callArgs: unknown[]) => {
          if (
            tempFaultsSeen >= TEMP_FAULT_SKIP &&
            tempFaultsSeen < TEMP_FAULT_SKIP + TEMP_FAULT_COUNT
          ) {
            tempFaultsSeen++;
            console.warn("[auth] TEMP fault injected");
            const injected = new Error("TEMP fault injection");
            injected.name = "MongoServerSelectionError";
            throw injected;
          }
          return value.apply(target, callArgs);
        };

        try {
          return await run(...args);
        } catch (error) {
          if (!isRetryableMongoError(error)) throw error;
          console.warn(
            "[auth] MongoDB query hit a closed topology — reconnecting and retrying once.",
            (error as Error).name
          );
          await reconnectMongo();
          return run(...args);
        }
      };
    },
  });
}

export const auth = betterAuth({
  database: (options: MongoAdapterOptions) =>
    withSelfHealingMongo(createMongoAdapter(options)),
  // ── JWT plugin ──────────────────────────────────────────────
  // Issues a signed access token (JWT) on every login / registration and
  // exposes the public JWKS at `/.well-known/jwks.json`. The Express API
  // verifies these tokens (see server `middleware/verifyToken.js`).
  // Tokens are short-lived (default 15m); the `definePayload` hook embeds
  // the user's role so the API can authorize without a DB lookup.
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          role: user.role,
          email: user.email,
        }),
      },
    }),
  ],
  user: {
       additionalFields: {
          role: {
              type:['admin', 'owner', 'customer'],
              input: false,
              defaultValue: 'customer'
            } 
        }
    },
    emailAndPassword: {
    enabled: true,
  },
  // Cache the session in a cookie (signed) so Edge middleware can read the
  // user's role without a DB round-trip. 5 min is a safe staleness window.
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
