import express from "express";
import db from "../db/connection.js";

const devEnv = true; // TODO: move this to an env variable
const router = express.Router();

// check if there is data, no auth
router.get("/data-check", async (req, res) => {
  try {
    const collections = ['answers', 'tournaments', 'scores'];

    for (const collectionName of collections) {
      const document = await db.collection(collectionName).findOne();
      console.log(`Sample document from ${collectionName}:`);
      console.log(JSON.stringify(document, null, 2));
      console.log('\n');
    }
  } catch (e) { }
  finally {}
});

export default router;