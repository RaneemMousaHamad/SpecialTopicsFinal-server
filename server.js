//here open the connection
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
//all these routes will be taken and put on server.js, why did Separation of Concerns (SoC) because routes of each user must be alone not with other users routes
import jobRoutes from "./Routes/jobs.js";
import businessRoutes from "./Routes/businesses.js";
import pgClient from "./db.js";

const app = express();
dotenv.config();
//PORT=5000
const PORT = process.env.PORT;

//middle Wares:biuld in middleware (means before the req  )
app.use(cors()); //Allow requests from anywhere, cors can anyone send req(make sure the req comming from authenticated)
app.use(express.json()); //
app.use(morgan("dev")); // to print the req info on terminal

// just for testing
app.get("/", (req, res) => {
  res.send("home route");
});

//any route start with locallhost:5000/api/jobs
app.use("/api/businesses", businessRoutes);
app.use("/api/jobs", jobRoutes);

// Handelling unexisted routes
app.use((req, res) => {
  res.status(404).json({ message: "route not found" });
});
pgClient.connect().then(() => {
  console.log("Connected to PostgreSQL");
  // we add .then (promise-based function, it needs time )and we need to make sure open a connection then do listen
  // wake the server up and running
  app.listen(PORT, () => {
    console.log("server is listenningg on http://localhost:${PORT}");
  });
});
