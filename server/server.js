import express from "express";
import cors from "cors";
import tournaments from "./routes/tournament.js";
import answer from './routes/answer.js';
import auth from './routes/auth.js';
import score from './routes/score.js';
import result from './pipelines/result.js';
import test from './test/tests.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/tournaments", tournaments);
app.use("/answer", answer);
app.use("/score", score);
app.use("/auth", auth); // we have /auth/register and /auth/login
app.use("/result", result);
app.use("/test", test);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
