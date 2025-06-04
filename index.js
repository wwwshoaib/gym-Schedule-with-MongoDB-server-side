const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");

const cors = require("cors");
const app = express();

const port = 8800;

app.use(express.json());
app.use(cors());


const uri = "mongodb+srv://gymScheduleDB:IoTCMKO8IK0m95Hf@cluster0.7twsfn9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//password: IoTCMKO8IK0m95Hf
//username: gymScheduleDB 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("connected with MongoDB atlas database!");

    const gymScheduleDB = client.db("gym-schedule").collection("schedule");

    app.post("/schedule", async (req, res) => {
      const scheduleData = req.body;

      // console.log(Object.keys(scheduleData));


      const result = await gymScheduleDB.insertOne(scheduleData);
      res.send(result);

    });
    app.get("/schedule", async (req, res) => {
      const result = await gymScheduleDB.find().toArray();
      res.send(result);
    })
    /**
     *  app.get("/schedule", async (req, res) => {
       const { searchParams } = req.query;
 
       console.log(searchParams);
 
       let option = {};
 
       if (searchParams) {
         option = { title: { $regex: searchParams, $options: "i" } };
       }
       const result = await gymSchedule.find(option).toArray();
       res.send(result);
     });
     */
    /**
     * app.delete("/schedule/:id", async (req, res) => {
      const { id } = req.params;
      const result = await gymSchedule.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
     */

    //Delete Operation
    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymScheduleDB.deleteOne(query);
      res.send(result);
    })

    app.get("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymScheduleDB.findOne(query);
      res.send(result);
    })

    //UPDATE operation
    app.get("/schedule/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await gymScheduleDB.findOne(filter);
      res.send(result);
    });

    //using PATCH method for the update
    app.patch("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: data?.title,
          day: data?.day,
          date: data?.date,
          hour: data?.hour
        }
      }
      const result = await gymScheduleDB.updateOne(query, update);
      res.send(result);
    })


    //using PATCH method for Done mark and Alldone mark
    app.patch("/status/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          isCompleted: true,
        }
      }
      const result = await gymScheduleDB.updateOne(query, update);
      res.send(result);
    })

    /**
     * app.patch("/schedule/:id", async (req, res) => {
      const { id } = req.params;

      console.log(id);
      const data = req.body;

      const filter = { _id: new ObjectId(id) };
      const result = await gymSchedule.updateOne(filter, {
        $set: {
          title: data.title,
          day: data.day,
          formattedDate: data.formattedDate,
        },
      });
      res.send(result);
    });
     */
    app.patch("/status/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      console.log(data, id);

      const filter = { _id: new ObjectId(id) };
      const result = await gymSchedule.updateOne(filter, {
        $set: {
          isCompleted: data.isCompleted,
        },
      });
      res.send(result);
    });

    //for the implementation search
    app.get("/search", async (req, res) => {
      const { searchParams } = req.query;
      let option = {};

      if (searchParams && searchParams.trim() !== "") {
        option = { title: { $regex: searchParams.trim(), $options: "i" } };
      }

      const result = await gymScheduleDB.find(option).toArray();
      res.send(result);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send(`server running on ${port}`);
});
app.listen(port, () => {
  console.log("server running");
});
