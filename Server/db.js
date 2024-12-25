import {MongoClient, ServerApiVersion} from "mongodb";
import "dotenv/config";

const uri = `mongodb+srv://saste-nashe-main:${process.env.MONGO_PASSWORD}@saste-nashe-db.xlhdm.mongodb.net/?retryWrites=true&w=majority&appName=saste-nashe-db`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

try {
	console.log("Attempting to connect to database...");
	await client.connect();
	console.log("Database client is successfully connected.");
} catch {
	console.log("There was an error with the database connection");
}

export default client.db('main-db')