import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    let tournamentIdObj;

    // Try to convert to ObjectId, if it fails, use the string version
    try {
      tournamentIdObj = new ObjectId(tournamentId);
    } catch (err) {
      tournamentIdObj = tournamentId;
    }

    const pipeline = [
      {
        $match: {
          tournamentId: tournamentIdObj.toString()
        }
      },
      {
        $addFields: {
          tournamentIdObj: { $toObjectId: "$tournamentId" }
        }
      },
      {
        $lookup: {
          from: "tournaments",
          localField: "tournamentIdObj",
          foreignField: "_id",
          as: "tournament"
        }
      },
      { $unwind: "$tournament" },
      {
        $lookup: {
          from: "scores",
          let: { tournamentId: "$tournamentIdObj" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$tournamentId", "$$tournamentId"] }
              }
            }
          ],
          as: "score"
        }
      },
      { $unwind: "$score" },
      {
        $addFields: {
          answerArray: { $objectToArray: "$answer" },
          scoreArray: "$score.scores"
        }
      },
      {
        $addFields: {
          answerDetails: {
            $map: {
              input: "$answerArray",
              as: "ans",
              in: {
                questionIndex: { $toInt: "$$ans.k" },
                userAnswer: {
                   $concat: [
                    { $toString: "$$ans.v.answer1" },
                    ":",
                    { $toString: "$$ans.v.answer2" }
                  ]
                },
                correctAnswer: { $arrayElemAt: ["$scoreArray", { $toInt: "$$ans.k" }] },
                isCorrect: {
                  $eq: [
                    { $concat: [
                      { $toString: "$$ans.v.answer1" },
                      ":",
                      { $toString: "$$ans.v.answer2" }
                    ]},
                    { $arrayElemAt: ["$scoreArray", { $toInt: "$$ans.k" }] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$user",
          answers: { $push: "$answerDetails" },
          totalCorrect: {
             $sum: {
               $reduce: {
                input: "$answerDetails",
                initialValue: 0,
                in: { $add: ["$$value", { $cond: ["$$this.isCorrect", 1, 0] }] }
              }
            }
          }
        }
      },
      {
        $project: {
          user: "$_id",
          answers: 1,
          totalCorrect: 1,
          totalAnswers: { $size: "$answers" }
        }
      },
      { $sort: { totalCorrect: -1 } }
    ];

    // Log the pipeline for debugging
    console.log("Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    const result = await db.collection('answers').aggregate(pipeline).toArray();

    // Log the result for debugging
    console.log("Aggregation Result:", JSON.stringify(result, null, 2));

    if (result.length > 0) {
      // Return all user results for the specific tournament, sorted by totalCorrect
      res.json({
        tournamentId: tournamentId,
        userResults: result.map(user => ({
          user: user.user,
          totalCorrect: user.totalCorrect,
          totalAnswers: user.totalAnswers,
          answers: user.answers.flat() // Flatten the nested array of answers
        }))
      });
    } else {
      // Log collection counts
      const answerCount = await db.collection('answers').countDocuments({ tournamentId: tournamentId });
      const tournamentCount = await db.collection('tournaments').countDocuments({ _id: tournamentIdObj });
      const scoreCount = await db.collection('scores').countDocuments({ tournamentId: tournamentId });
      console.log(`Collection counts for tournament ${tournamentId} - Answers: ${answerCount}, Tournaments: ${tournamentCount}, Scores: ${scoreCount}`);

      res.status(404).json({ message: 'No users found for this tournament' });
    }
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});

export default router;