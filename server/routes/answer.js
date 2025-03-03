import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("answers");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("answers");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post("/", async (req, res) => {
  try {
    let newAnswer = {
      tournamentId: req.body.tournamentId,
      user: req.body.user,
      answer: req.body.answer
    };

    let { tournamentId, user } = newAnswer;

    let collection = await db.collection("answers");
    const answerExists = await collection.findOne({ tournamentId, user });

    console.log(tournamentId, user);

    if (answerExists) {
      res.status(500).send("User already posted answer");
      return;
    }

    let result = await collection.insertOne(newAnswer);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("answers");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;