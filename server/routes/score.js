import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware auth (unchanged)
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

// POST /scores - Add scores for a tournament
router.post("/", authenticateToken, async (req, res) => {
  try {
    let newScore = {
      tournamentId: new ObjectId(req.body.tournamentId),
      scores: req.body.scores
    };
    let collection = await db.collection("scores");
    let result = await collection.insertOne(newScore);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding scores");
  }
});

// GET /scores - Retrieve all scores
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("scores");
    let result = await collection.find({}).toArray();
    
    if (result.length === 0) {
      res.status(404).send("No scores found");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("Error retrieving all scores:", err);
    res.status(500).send("Error retrieving all scores");
  }
});

// GET /scores/{tournamentId} - Retrieve scores for a specific tournament
router.get("/:tournamentId", async (req, res) => {
  try {
    let collection = await db.collection("scores");
    let tournamentId = req.params.tournamentId;

    // Try to convert to ObjectId, if it fails, use the string version
    let query;
    try {
      query = { tournamentId: new ObjectId(tournamentId) };
    } catch (err) {
      query = { tournamentId: tournamentId };
    }

    let result = await collection.find(query).toArray();

    if (result.length === 0) {
      res.status(404).send("Scores not found");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("Error retrieving scores:", err);
    res.status(500).send("Error retrieving scores");
  }
});

// PATCH /scores/{tournamentId} - Update scores for a tournament
router.patch("/:tournamentId", authenticateToken, async (req, res) => {
  try {
    const query = { tournamentId: new ObjectId(req.params.tournamentId) };
    const updates = {
      $set: {
        scores: req.body.scores
      }
    };
    
    let collection = await db.collection("scores");
    let result = await collection.updateOne(query, updates);
    
    if (result.matchedCount === 0) {
      res.status(404).send("Scores not found");
    } else {
      res.status(200).send("Scores updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating scores");
  }
});

router.delete("/:tournamentId", authenticateToken, async (req, res) => {
  try {
    const query = { tournamentId: new ObjectId(req.params.tournamentId) };
    
    const collection = db.collection("scores");
    let result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      res.status(404).send("Scores not found");
    } else {
      res.status(200).send("Scores deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting scores");
  }
});

export default router;