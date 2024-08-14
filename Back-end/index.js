
const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// const openai = require('openai');

dotenv.config();

const app = express();
//Middleware
app.use(cors());
app.use(express.json());


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
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    
    //Admin stats
    //Get all instructors

    //--------USERS ROUTE-------------

    //Get all users
    //Get user by Id
    //Get user by email
    //Delete a user
    //Update a user

    //---------CLASSES ROUTE-----------

    //Add new classes
    app.post('/new-class',  async (req, res) => {
      const newClass = req.body;
      // newClass.availableSeats = parseInt(newClass.availableSeats)
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
  });

    //Get all approved classes 
    app.get('/classes', async (req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
  })
  
    //Get all classes added  by instructor (instructor email)
    app.get('/classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email};
      const result = await classesCollection.find(query).toArray();
      res.send(result);
  })

    //Manage classes (all classes visible)
    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
  })

    //Update class status and reason (change status and reason)
    app.patch('/change-status/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason =req.body.reason;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          status:status,
          reason: reason,
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
  })

    //Get approved classes in seperate route
    app.get('/approved-classes', async (req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
  })

    //Update a class details
    app.put('/update-class/:id', async (req, res) => {
      const id = req.params.params.id;
      const updateClass = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status:'pending',
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
  })

    //get single class by id for details page
    app.get('/class/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await classesCollection.findOne(query);
      res.send(result);
  })



    //------------CART ROUTES------------
    //get cart item id for checking if a class is already in cart
    //delete an item from cart

    //----------PAYMENT ROUTES-----------
    //post payment info

    //-----------ENROLLED ROUTES----------

    //----------APPLIED ROUTES------------

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
    res.send('API is running...after mongobd..still working');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
