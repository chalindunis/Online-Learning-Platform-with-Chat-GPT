
const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// const openai = require('openai');

dotenv.config();

const app = express();
//Middleware
app.use(express.json());
app.use(cors());

// openai.apiKey = process.env.OPENAI_API_KEY;

const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

//ROUTES
//Set token


// Mondodb connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-online-learnin.uybyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-online-learning`;

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

    //create the database and collection
    const database = client.db("online-learning");

    const userCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");


    //The platform should allow users to register, log in, and enroll in courses. 
    //Instructors should be able to create and manage courses, and
    //students should be able to view and enroll in available courses. ``

    //verify admin
    //verify instructor

    //Get all users
    //Get user by Id
    //Get user by email
    //Delete a user
    //Update a user

    //classes route here
    //get data from the database showing approved classes
    //Get all classes added  by instructor (instructor email)
    

    //manage classes
    
    //Get all classes
    //Change status of a class
    //get approved classes
    //Get all instructors
    //Update a class
    //get single class by id for details page

    //add to cart
    //get cart item id for checking if a class is already in cart
    //delete an item from cart
    //Payment routes
    //post payment info

    //Enrollled routes
    //Admin stats
    //Get all instructors
    //Applied routes

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
    res.send('API is running...after mongobd..still working');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
