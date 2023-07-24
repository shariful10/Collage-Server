const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bq2ef3t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		const collagesCollection = client.db("acamediaDb").collection("collages");
		const selectedCollection = client.db("acamediaDb").collection("selected");
		const feedbackCollection = client.db("acamediaDb").collection("feedback");

		// Get all Collages
		app.get("/collages", async (req, res) => {
			const result = await collagesCollection.find().toArray();
			res.send(result);
		});

		// Get a single Collage
		app.get("/collage/:id", async (req, res) => {
			const id = req.params.id;
			const result = await collagesCollection.findOne({ _id: new ObjectId(id) });
			res.send(result);
		});

		// Select Data Save to Database
		app.post("/selected", async (req, res) => {
			const myColleges = req.body;
			const result = await selectedCollection.insertOne(myColleges);
			res.send(result);
		});

		// Get a selected Collage Data
		app.get("/selected/:email", async (req, res) => {
			const email = req.params.email;
			const result = await selectedCollection.find({ email: email }).toArray();
			res.send(result);
		});

		// Feedback Data Save to Database
		app.post("/feedback", async (req, res) => {
			const reviewData = req.body;
			const result = await feedbackCollection.insertOne(reviewData);
			res.send(result);
		});

		// Get all Feedback Data
		app.get("/feedback", async (req, res) => {
			const result = await feedbackCollection.find().toArray();
			res.send(result);
		});


		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Collage Server is running...");
});

app.listen(port, () => {
	console.log(`Collage is running on port ${port}`);
});
