import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Hotel backend is running",
  });
});

app.get("/api/debug-db", async (req, res) => {
  try {
    const databaseResult = await pool.query(
      "SELECT current_database()"
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM hotels"
    );

    const hotelsResult = await pool.query(
      "SELECT * FROM hotels ORDER BY id DESC"
    );

    console.log("DATABASE:");
    console.log(databaseResult.rows[0]);

    console.log("HOTEL COUNT:");
    console.log(countResult.rows[0]);

    console.log("HOTELS:");
    console.log(hotelsResult.rows);

    res.json({
      database:
        databaseResult.rows[0].current_database,

      count: Number(
        countResult.rows[0].count
      ),

      hotels: hotelsResult.rows,
    });

  } catch (error) {
    console.error(
      "DEBUG DATABASE ERROR:",
      error
    );

    res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
});

app.get("/api/hotels", async (req, res) => {
  try {
    console.log("GET /api/hotels");

    const result = await pool.query(
      "SELECT * FROM hotels ORDER BY id DESC"
    );

    console.log(
      "HOTELS FROM DATABASE:"
    );

    console.log(result.rows);

    res.json(result.rows);

  } catch (error) {
    console.error(
      "GET HOTELS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to get hotels",
      error: error.message,
    });
  }
});

app.post("/api/hotels", async (req, res) => {
  try {
    console.log(
      "================================="
    );

    console.log(
      "ADD HOTEL REQUEST:"
    );

    console.log(req.body);

    const {
      name,
      price,
      description,
      latitude,
      longitude,
      images,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO hotels
      (
        name,
        price,
        description,
        latitude,
        longitude,
        images
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
      `,
      [
        name,
        price,
        description,
        latitude,
        longitude,
        images || [],
      ]
    );

    console.log(
      "HOTEL ADDED:"
    );

    console.log(
      result.rows[0]
    );

    console.log(
      "================================="
    );

    res.status(201).json(
      result.rows[0]
    );

  } catch (error) {
    console.error(
      "ADD HOTEL ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to add hotel",
      error: error.message,
    });
  }
});

app.put("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      description,
      latitude,
      longitude,
      images,
    } = req.body;

    console.log(
      "================================="
    );

    console.log(
      "UPDATE HOTEL REQUEST:"
    );

    console.log("ID:", id);

    console.log(req.body);

    const result = await pool.query(
      `
      UPDATE hotels
      SET
        name = $1,
        price = $2,
        description = $3,
        latitude = $4,
        longitude = $5,
        images = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        price,
        description,
        latitude,
        longitude,
        images || [],
        id,
      ]
    );

    if (result.rows.length === 0) {
      console.log(
        "HOTEL NOT FOUND:",
        id
      );

      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    console.log(
      "HOTEL UPDATED:"
    );

    console.log(
      result.rows[0]
    );

    console.log(
      "================================="
    );

    res.json(
      result.rows[0]
    );

  } catch (error) {
    console.error(
      "UPDATE HOTEL ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update hotel",
      error: error.message,
    });
  }
});

app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "DELETE HOTEL:",
      id
    );

    const result = await pool.query(
      `
      DELETE FROM hotels
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    console.log(
      "HOTEL DELETED:"
    );

    console.log(
      result.rows[0]
    );

    res.json({
      message:
        "Hotel deleted successfully",

      hotel:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "DELETE HOTEL ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete hotel",
      error: error.message,
    });
  }
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    "================================="
  );

  console.log(
    "CORRECT SERVER.JS IS RUNNING"
  );

  console.log(
    "================================="
  );

  console.log(
    `Hotel backend running on http://localhost:${PORT}`
  );
});