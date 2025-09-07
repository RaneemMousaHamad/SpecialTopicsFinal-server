import express from "express";
import pgClient from "../db.js";

const businessRoutes = express.Router();

//app.use("/api/businesses", businessRoutes);
//req: localhost:5000/api/businesses/
// localhost:5000/api/businesses/:id
// GET one business by ID
businessRoutes.get("/:id", async (req, res) => {
  try {
    const result = await pgClient.query(
      "SELECT * FROM business WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET all businesses

businessRoutes.get("/", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM business ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// localhost:5000/api/businesses
// POST - create a new business
// body { name, industry, email, location }
businessRoutes.post("/", async (req, res) => {
  const {
    business_name,
    email,
    industry,
    location,
    contact_number,
    brief_description,
    business_social_media,
  } = req.body;

  try {
    const result = await pgClient.query(
      `INSERT INTO business (business_name, email, industry, location, contact_number, brief_description, business_social_media)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, //give back all the rows I have insert:including the auto-generated id and all columns.
      [
        business_name,
        email,
        industry,
        location,
        contact_number,
        brief_description,
        business_social_media,
      ]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// localhost:5000/api/businesses/:id
// PUT - update a business
businessRoutes.put("/:id", async (req, res) => {
  const {
    /// send the edited values
    business_name,
    email,
    industry,
    location,
    contact_number,
    brief_description,
    business_social_media,
  } = req.body;

  try {
    const result = await pgClient.query(
      `UPDATE business 
       SET business_name=$1, email=$2, industry=$3, location=$4, contact_number=$5, brief_description=$6, business_social_media=$7 
       WHERE id=$8 
       RETURNING *`,
      [
        business_name,
        email,
        industry,
        location,
        contact_number,
        brief_description,
        business_social_media,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default businessRoutes;
