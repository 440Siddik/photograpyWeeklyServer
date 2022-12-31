const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9ef9oj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const serviceCollection = client
      .db("phWeekly")
      .collection("services");

    const reviewsCollection = client
      .db("phWeekly")
      .collection("reviews");

    const addServiceCollection = client
      .db("phWeekly")
      .collection("addservice");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const allservices = await cursor.toArray();
      res.send(allservices);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //reviews

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/allreviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const allreviews = await cursor.toArray();
      res.send(allreviews);
    });

    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });

    // addservice api
    app.post("/addservice", async (req, res) => {
      const addedService = req.body;
      const result = await addServiceCollection.insertOne(addedService);
      res.send(result);
    });

    app.get("/addservice", async (req, res) => {
      const query = {};
      const cursor = addServiceCollection.find(query);
      const addServices = await cursor.toArray();
      res.send(addServices);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
