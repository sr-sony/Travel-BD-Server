const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());

//mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.spo52sg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("travelBd").collection("services");
    const reviewCollection = client.db('travelBd').collection('reviews')
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({_id: -1});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/allitems", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({_id: -1});
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
      });

      //item add api
      app.post('/services', async(req, res) =>{
        const user = req.body;
        console.log(user)
        const result = await serviceCollection.insertOne(user)
        res.send(result)
    })
    // reviews api
    app.get('/reviews', async(req, res)=>{
        const query = {}
        const cursor = reviewCollection.find(query).sort({_id: -1});
        const reviews = await cursor.toArray()
        res.send(reviews)
    })
    app.get('/reviews/:id', async(req, res) =>{
      const id = req.params.id
      console.log(id)
      const query = {_id : ObjectId(id)}
      const result = await reviewCollection.findOne(query)
      res.send(result)
    })
    app.post('/reviews', async(req, res) =>{
        const user = req.body;
        console.log(user)
        const result = await reviewCollection.insertOne(user)
        res.send(result)
    })
    app.put('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : ObjectId(id)}
      const review = req.body;
      const option = {upsert : true}
      const updateReview = {
        $set: {
          userReview: review.userReview
        }
      }
      const result = await reviewCollection.updateOne(filter, updateReview, option)
      res.send(result)
    })

    app.delete('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)}
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })
  } finally {
  }
}

run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("server listening on port", port);
});
