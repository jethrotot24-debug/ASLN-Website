const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "asln_db",
    password: "Omuttuju256",
    port: 5432,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "ASLN Server is running successfully! 🚀",
        status: "online"
    });
});

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    country,
    location,
    bio,
    interests
} = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await pool.query(
            `INSERT INTO users (email, password_hash, role)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [email, passwordHash, "member"]
        );

        const userId = newUser.rows[0].id;

       // Create profile linked to user
await pool.query(
    `INSERT INTO profiles (
        user_id,
        first_name,
        last_name,
        date_of_birth,
        country,
        city,
        bio,
        interested_in
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
        userId,
        firstName,
        lastName,
        dateOfBirth,
        country,
        location,
        bio,
        interests
    ]
);

        res.status(201).json({
            message: "Account created successfully!",
            userId: userId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while creating account"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ASLN server running on http://localhost:${PORT}`);
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL database successfully!"))
    .catch(err => console.error("Database connection error:", err.message));