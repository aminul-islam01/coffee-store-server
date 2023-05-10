const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aws78to.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffees");

        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            query = {_id: new ObjectId(id)}
            const coffee = await coffeeCollection.findOne(query);
            res.send(coffee);
        })
       
        app.post('/coffees', async(req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const coffee = req.body;
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        app.delete('/coffees/:id', async(req, res) => {
            const id = req.params.id;
           
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('coffee making server is running')
})

app.listen(port, () => {
    console.log(`coffee server is running on port ${port}`)
})