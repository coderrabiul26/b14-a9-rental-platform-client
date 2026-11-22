import { betterAuth } from "better-auth";
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
 */
async function ensureMongoConnected(): Promise<void> {
  const topology = (client as unknown as {
    topology?: { isConnected?: () => boolean };
  }).topology;

  // `undefined` topology = not connected yet; the driver connects lazily.
  if (!topology || topology.isConnected?.() !== false) return;

  console.warn("[auth] MongoDB topology was closed after a failed operation — reconnecting.");
  await client.connect();
}

/** Runs every Better Auth database call through `ensureMongoConnected()` first. */
function withSelfHealingMongo<T extends object>(adapter: T): T {
  return new Proxy(adapter, {
    get(target, property) {
      const value = Reflect.get(target, property);
      if (typeof value !== "function") return value;
      return async (...args: unknown[]) => {
        await ensureMongoConnected();
        return value.apply(target, args);
      };
    },
  });
}

export const auth = betterAuth({
  database: (options: MongoAdapterOptions) =>
    withSelfHealingMongo(createMongoAdapter(options)),
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
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
