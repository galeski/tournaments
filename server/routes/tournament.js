import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();
import jwt from "jsonwebtoken";

// middleware auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get("/", async (req, res) => {
  let collection = await db.collection("tournaments");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    let collection = await db.collection("tournaments");
    let results = await collection.find({ user: req.user.userId }).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user tournaments");
  }
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("tournaments");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    let newTournament = {
      title: req.body.title,
      questions: req.body.questions,
      user: req.user.userId,
    };
    let collection = await db.collection("tournaments");
    let result = await collection.insertOne(newTournament);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id), user: req.user.userId };
    const updates = {
      $set: {
        title: req.body.title,
        questions: req.body.questions
      }
    };
    
    let collection = await db.collection("tournaments");
    let result = await collection.updateOne(query, updates);
    
    if (result.matchedCount === 0) {
      res.status(404).send("Tournament not found or unauthorized");
    } else {
      res.status(200).send("Tournament updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating tournament");
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id), user: req.user.userId };
    
    const collection = db.collection("tournaments");
    let result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      res.status(404).send("Tournament not found or unauthorized");
    } else {
      res.status(200).send("Tournament deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;