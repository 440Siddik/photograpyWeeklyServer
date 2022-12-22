const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require("mongodb");

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h9ef9oj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run () {
try{
const serviceCollection = client.db('phWeekly').collection('services')

app.get('/services', async(req, res) => {
  const query = {}
  const cursor = serviceCollection.find(query).limit(3);
  const services = await cursor.toArray();
  res.send(services)
})

app.get('/allservices', async(req, res) => {
  const query = {};
  const cursor = serviceCollection.find(query)
  const allservices = await cursor.toArray()
  res.send(allservices)
})
}
finally{}
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
res.send('Server is running')
})

app.listen(port , (req, res) => {
  console.log(`Server is running on port ${port}`);
})