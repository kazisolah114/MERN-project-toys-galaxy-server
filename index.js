const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// toysbeast
// sdYv3auBnQbhON2n


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://toysbeast:sdYv3auBnQbhON2n@cluster0.xjdofai.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const toysCollection = client.db("toysDB").collection("toysbeast")
    // Connect the client to the server	(optional starting in v4.7 ssdd)
    // await client.connect();

    app.post('/addtoys', async(req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy)
      res.send(result)
    })

    app.get('/alltoys', async(req, res) => {
      const query = toysCollection.find().limit(20);
      const toyItems = await query.toArray();
      res.send(toyItems)
    })
    app.get('/mytoys', async(req, res) => {
      const query = toysCollection.find();
      const toyItems = await query.toArray();
      res.send(toyItems)
    })

    app.get('/alltoys/:id', async(req, res) => {
      const id = req.params.id;
      const toyItem = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(toyItem);
      res.send(result)
    })

    app.put('/updatetoys/:id', async(req, res) => {
      const id = req.params.id;
      const toyItem = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedToy = req.body;
      const toy = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
        }
      }
      const result = await toysCollection.updateOne(toyItem, toy, options);
      res.send(result)
    })

    app.delete('/mytoys/:id', async(req, res) => {
      const id = req.params.id;
      const toyItem = { _id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(toyItem);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('The server is running')
})
app.listen(port, () => {
    console.log("The server is running on console port", port)
})