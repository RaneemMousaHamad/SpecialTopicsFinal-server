import express from "express";
import pgClient from "../db.js";

const jobRoutes = express.Router();

// localhost:5000/api/jobs
// // GET all jobs
// jobRoutes.get("/", async (req, res) => {
//   try {
//     const result = await pgClient.query("SELECT * FROM job");
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// GET all jobs (with business name)
jobRoutes.get("/", async (req, res) => {
  try {
    const result = await pgClient.query(`
      SELECT 
        job.id, 
        job.job_title, 
        job.job_description, 
        job.job_skills, 
        job.business_id,
        business.business_name
      FROM job
      LEFT JOIN business ON job.business_id = business.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// localhost:5000/api/jobs/:id
// GET one job by id
jobRoutes.get("/:id", async (req, res) => {
  try {
    const result = await pgClient.query(
      "SELECT * FROM job WHERE business_id = $1",
      [req.params.business_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// localhost:5000/api/jobs
// POST - create a new job
// body { title, description, skills, business_id }
// POST create job
jobRoutes.post("/", async (req, res) => {
  const { job_title, job_description, job_skills, business_id } = req.body;
  try {
    const result = await pgClient.query(
      `INSERT INTO job (job_title, job_description, job_skills, business_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [job_title, job_description, job_skills, business_id]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// DELETE job by ID
jobRoutes.delete("/:id", async (req, res) => {
  try {
    const result = await pgClient.query(
      "DELETE FROM job WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});
export default jobRoutes;
