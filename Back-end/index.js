
const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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



//-------SET TOKEN---------

//Authorization
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
      return res.status(401).send({ error: true, message: 'Unauthorize access' })
  }
  const token = authorization?.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).send({ error: true, message: 'forbidden user or token has expired' })
      }
      req.decoded = decoded;
      next()
  })
}


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
    // Connect the client to the server
    await client.connect();

    //create the database and collection
    const database = client.db("online-learning");

    const userCollection = database.collection("users");
    const classesCollection = database.collection("classes");// courses
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");


    //The platform should allow users to register, log in, and enroll in courses. 
    //Instructors should be able to create and manage courses, and
    //students should be able to view and enroll in available courses.

    //------MIDDLEWARE FOR ADMIN & INSTRUCTOR--------
    //verify admin
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role === 'admin') {
          next()
      }
      else {
          return res.status(401).send({ error: true, message: 'Unauthorize access' })
      }
  }

    //verify instructor
    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role === 'instructor' || user.role === 'admin') {
          next()
      }
      else {
          return res.status(401).send({ error: true, message: 'Unauthorize access' })
      }
  }

    
    //Admin stats
    app.get("/admin-stats",verifyJWT ,verifyAdmin, async(req, res) => {
      const approvedClasses = (await classesCollection.find({status: "approved"}).toArray()).length;
      const pendingClasses = (await classesCollection.find({status: "pending"}).toArray()).length;
      const instructors = (await usersCollection.find({role: "instructor"}).toArray()).length;
      const totalClasses = (await classesCollection.find().toArray()).length;
      const totalEnrolled = (await enrolledCollection.find().toArray()).length;

      const result = {
        approvedClasses,
        pendingClasses,
        instructors,
        totalClasses,
        totalEnrolled,
      }
      res.send(result);
    })
    //Get all instructors
    app.get('/instructors', async(req, res) => {
      const result = await userCollection.find({role: 'instructor'}).toArray();
      res.send(result);
    })

    //--------USERS ROUTE-------------

    //Add new user
    app.post('/new-user', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
  })

    app.post('/api/set-token', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '24h' })
      res.send({ token })
  })

    //Get all users
    app.get('/users', async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
  })

    //Get user by Id
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
  })

    //Get user by email
    app.get('/user/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
  })

    //Delete a user
    app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
  })

    //Update a user
    app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.option,
              address: updatedUser.address,
              phone: updatedUser.phone,
              about: updatedUser.about,
              photoUrl: updatedUser.photoUrl,
              skills: updatedUser.skills ? updatedUser.skills : null,
          }
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
  })

    //---------CLASSES ROUTE-----------

    //Add new classes
    app.post('/new-class', verifyJWT, verifyInstructor, async (req, res) => {
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
    app.get('/classes/:email',verifyJWT ,verifyInstructor, async (req, res) => {
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
    app.patch('/change-status/:id',verifyJWT ,verifyAdmin, async (req, res) => {
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
    app.put('/update-class/:id',verifyJWT ,verifyAdmin, async (req, res) => {
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

    // add to cart
    app.post('/add-to-cart', verifyJWT, async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
  })
    // Get cart item id for checking if a class is already in cart
    app.get('/cart-item/:id', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const email = req.query.email;
        const query = { classId: id, userMail: email };
        const projection = { classId: 1 };
        const result = await cartCollection.findOne(query, { projection: projection });
        res.send(result);
  })

    app.get('/cart/:email', verifyJWT, async (req, res) => {
        const email = req.params.email;
        const query = { userMail: email };
        const projection = { classId: 1 };
        const carts = await cartCollection.find(query, { projection: projection }).toArray();
        const classIds = carts.map(cart => new ObjectId(cart.classId));
        const query2 = { _id: { $in: classIds } };
        const result = await classesCollection.find(query2).toArray();
        res.send(result);
  })

    // Delete a item form cart
    app.delete('/delete-cart-item/:id', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const query = { classId: id };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
  })


  //------------PAYMENT ROUTES-------------

  app.post('/create-payment-intent', verifyJWT, async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
      });
      res.send({
          clientSecret: paymentIntent.client_secret
      });
  })
  // Post payment info 
    app.post('/payment-info', verifyJWT, async (req, res) => {
        const paymentInfo = req.body;
        const classesId = paymentInfo.classesId;
        const userEmail = paymentInfo.userEmail;
        const singleClassId = req.query.classId;
        let query;
        // const query = { classId: { $in: classesId } };
        if (singleClassId) {
            query = { classId: singleClassId, userMail: userEmail };
        } else {
            query = { classId: { $in: classesId } };
        }
        const classesQuery = { _id: { $in: classesId.map(id => new ObjectId(id)) } }
        const classes = await classesCollection.find(classesQuery).toArray();
        const newEnrolledData = {
            userEmail: userEmail,
            classesId: classesId.map(id => new ObjectId(id)),
            transactionId: paymentInfo.transactionId,
        }
        const updatedDoc = {
            $set: {
                totalEnrolled: classes.reduce((total, current) => total + current.totalEnrolled, 0) + 1 || 0,
                availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1 || 0,
            }
        }
        // const updatedInstructor = await userCollection.find()
        const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc, { upsert: true });
        const enrolledResult = await enrolledCollection.insertOne(newEnrolledData);
        const deletedResult = await cartCollection.deleteMany(query);
        const paymentResult = await paymentCollection.insertOne(paymentInfo);
        res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
  })

    app.get('/payment-history/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
  })

    app.get('/payment-history-length/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userEmail: email };
        const total = await paymentCollection.countDocuments(query);
        res.send({ total });
  })


    //-----------ENROLLED ROUTES----------

    //Based on popular classes
    app.get("/popular_classes", async(req, res) => {
      const result = await classesCollection.find().sort({totalEnrolled: -1}).limit(6).toArray();
      res.send(result);
    })

    //Based on popular instructors
    app.get("/popular_instructors", async(req, res) => {
      const pipeline = [
        {
            $group: {
                _id: "$instructorEmail",
                totalEnrolled: { $sum: "$totalEnrolled" },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "email",
                as: "instructor"
            }
        },
        {
            $match: {
              "instructor.role": "instructor",
            }
        },
        {
            $project: {
                _id: 0,
                instructor: {
                    $arrayElemAt: ["$instructor", 0]
                },
                totalEnrolled: 1
            }
        },
        {
            $sort: {
                totalEnrolled: -1
            }
        },
        {
            $limit: 6
        }
    ]
    const result = await classesCollection.aggregate(pipeline).toArray();
    res.send(result);

  })

    app.get('/enrolled-classes/:email',verifyJWT, async(req, res) => {
      const email = req.params.email;
      const query = {userEmail: email};
      const pipeline = [
        {
          $match: query 
        },
        {
          $lookup: {
            from: "classes",
            localField: "classesId",
            foreignField: "_id",
            as: "classes"
          }
        },
        {
          $unwimd: "$classes"
        },
        {
          $lookup: {
            from: "users",
            localField: "classes.instructorEmail",
            foreignField: "email",
            as: "instructor"
          }
        },
        {
          $project: {
            _id:0,
            instructor:{
              $arrayElemAt: ["$instructor", 0]
            },
            classes: 1
          }
        }
      ]
    
    const result = await emnrolledCollection.aggregate(pipieline).toArray();
    res.send(result);
  })

    //----------APPLIED ROUTES------------
    app.post('/as-instructor', async (req, res) => {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
  })
  app.get('/applied-instructors/:email',   async (req, res) => {
      const email = req.params.email;
      const result = await appliedCollection.findOne({email});
      res.send(result);
  });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Online-learning API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
