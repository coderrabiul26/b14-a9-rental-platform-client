// TEMP diagnostic: does MongoClient.connect() revive a closed topology?
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const uri = readFileSync(".env", "utf8").match(/MONGODB_URI=(.*)/)?.[1]?.trim();
if (!uri) throw new Error("MONGODB_URI not found in .env");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
const col = () => client.db("rental-platform").collection("user");

await client.connect();
const before = await col().findOne({}, { projection: { _id: 1 } });
console.log("1. connected. findOne:", !!before, "| topology.isConnected():", client.topology?.isConnected?.());

// Simulate the state after a fatal driver failure / client.close()
await client.close();
console.log("2. after close(). topology.isConnected():", client.topology?.isConnected?.());
try {
  await col().findOne({});
  console.log("   op after close: SUCCEEDED (unexpected!)");
} catch (e) {
  console.log("   op after close threw:", e.name, "|", String(e.message).slice(0, 140));
}

// The key question: does connect() rebuild the topology?
try {
  await client.connect();
  const doc = await col().findOne({}, { projection: { _id: 1 } });
  console.log("3. connect() after close: OK. op:", !!doc, "| topology.isConnected():", client.topology?.isConnected?.());
} catch (e) {
  console.log("3. RECONNECT FAILED:", e.name, "|", String(e.message).slice(0, 200));
}

// Double-connect on a healthy client (should be a no-op / safe)
try {
  await client.connect();
  console.log("4. connect() on healthy client: OK");
} catch (e) {
  console.log("4. connect() on healthy client threw:", e.name, "|", String(e.message).slice(0, 140));
}

await client.close();
console.log("done");
