import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("tournaments");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("tournaments");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post("/", async (req, res) => {
  try {
    let newTournament = {
      title: req.body.title,
      questions: req.body.questions
    };
    let collection = await db.collection("tournaments");
    let result = await collection.insertOne(newTournament);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        questions: req.body.questions
      }
    };
    
    let collection = await db.collection("tournaments");
    let result = await collection.updateOne(query, updates);
    
    if (result.matchedCount === 0) {
      res.status(404).send("Tournament not found");
    } else {
      res.status(200).send("Tournament updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating tournament");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("tournaments");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;