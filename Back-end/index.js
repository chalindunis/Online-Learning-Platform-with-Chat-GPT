
const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const cors = require('cors');
// const openai = require('openai');

dotenv.config();

const app = express();
// app.use(express.json());
// app.use(cors());

// openai.apiKey = process.env.OPENAI_API_KEY;

const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// Mondodb connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-online-learnin.uybyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-online-learning`;
// const uri = "mongodb+srv://chalindunisal1998:wfDyTVoc7yDrcHNA@cluster0-online-learnin.uybyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-online-learning";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('API is running...after mongobd..');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
