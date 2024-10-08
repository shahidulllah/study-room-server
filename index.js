//Initial Declaration
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
    cors()
  );
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcso25z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        //Collection
        const assignmentCollection = client.db('assignmentDB').collection('assignment');
        const submitedCollection = client.db('assignmentDB').collection('submited');
        // const giveMarkCollection = client.db('assignmentDB').collection('mark');


        //------------
        //POST
        //------------   
        //Post assignments
        app.post('/assignments', async (req, res) => {
            const userAssignment = req.body;
            console.log(userAssignment);

            const result = await assignmentCollection.insertOne(userAssignment);
            res.send(result)
        })

        //Get assignments
        app.get('/assignments', async (req, res) => {
            const result = await assignmentCollection.find().toArray();
            res.send(result);
        })

        //Get assignments by Id
        app.get('/assignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query);
            res.send(result);
        })



        //Post submition
        app.post('/submited', async (req, res) => {
            const submitedAssignment = req.body;
            console.log(submitedAssignment);

            const result = await submitedCollection.insertOne(submitedAssignment);
            res.send(result)
        })

        //Get submision
        app.get('/submited', async (req, res) => {
            const result = await submitedCollection.find().toArray();
            res.send(result);
        })

        //Get submission specific user
        app.get('/submited/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await submitedCollection.find(query).toArray();
            res.send(result);
        })

        // Update Assignment
        app.put('/assignments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedAssignment = req.body;
            const assignment = {
                $set: {
                    title: updatedAssignment.title,
                    thumbnailImageURL: updatedAssignment.thumbnailImageURL,
                    description: updatedAssignment.description,
                    ddifficultyLevel: updatedAssignment.ddifficultyLevel,
                    marks: updatedAssignment.marks,
                    dueDate: updatedAssignment.dueDate,

                }
            }

            const result = await assignmentCollection.updateOne(filter, assignment, options);
            res.send(result);
        })


        // Update Submited assignment by giving mark
        app.put('/submited/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateSubmitedAssignment = req.body;
            const submitedAssignment = {
                $set: {
                    feedback: updateSubmitedAssignment.feedback,
                    obtainMarks: updateSubmitedAssignment.obtainMarks,
                    status: updateSubmitedAssignment.status,
                }
            }

            const result = await submitedCollection.updateOne(filter, submitedAssignment, options);
            res.send(result);
        })

        //Delete document
        app.delete('/assignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


//Checking
app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING SUCCESSFULLY..!')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})