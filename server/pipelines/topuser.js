import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pipeline = [
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
          correctAnswers: {
            $reduce: {
              input: "$answerArray",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $cond: [
                      {
                        $eq: [
                          { $concat: [
                            { $toString: "$$this.v.answer1" },
                            ":",
                            { $toString: "$$this.v.answer2" }
                          ]},
                          { $arrayElemAt: ["$scoreArray", { $toInt: "$$this.k" }] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$user",
          correctAnswers: { $sum: "$correctAnswers" },
          totalAnswers: { $sum: { $size: "$answerArray" } }
        }
      },
      {
        $project: {
          user: "$_id",
          correctAnswers: 1,
          totalAnswers: 1,
          percentageCorrect: {
            $multiply: [
              { $divide: ["$correctAnswers", "$totalAnswers"] },
              100
            ]
          }
        }
      },
      { $sort: { correctAnswers: -1, percentageCorrect: -1 } },
      { $limit: 1 }
    ];

    // Log the pipeline for debugging
    console.log("Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    const result = await db.collection('answers').aggregate(pipeline).toArray();

    // Log the result for debugging
    console.log("Aggregation Result:", JSON.stringify(result, null, 2));

    if (result.length > 0) {
      res.json({
        userId: result[0]._id,
        correctAnswers: result[0].correctAnswers
      });
    } else {
      // Log collection counts
      const answerCount = await db.collection('answers').countDocuments();
      const tournamentCount = await db.collection('tournaments').countDocuments();
      const scoreCount = await db.collection('scores').countDocuments();
      console.log(`Collection counts - Answers: ${answerCount}, Tournaments: ${tournamentCount}, Scores: ${scoreCount}`);

      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error('Error fetching top user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});

export default router;