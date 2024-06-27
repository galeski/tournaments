import express from "express";
import cors from "cors";
import tournaments from "./routes/tournament.js";
import answer from './routes/answer.js';
import auth from './routes/auth.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/tournaments", tournaments);
app.use("/answer", answer);
// we have /auth/register and /auth/login
app.use("/auth", auth);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
