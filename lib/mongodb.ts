import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise = globalForMongo.mongoClientPromise;

export async function getDatabase() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, {
      maxPoolSize: 10
    }).connect();

    if (process.env.NODE_ENV !== "production") {
      globalForMongo.mongoClientPromise = clientPromise;
    }
  }

  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "portfolio";
  return client.db(dbName);
}
