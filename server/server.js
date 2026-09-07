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

// Login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check that both fields were provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find the user and their profile
        const result = await pool.query(
            `SELECT
                users.id,
                users.email,
                users.password_hash,
                profiles.first_name,
                profiles.last_name,
                profiles.date_of_birth,
                profiles.country,
                profiles.city,
                profiles.bio,
                profiles.interested_in
            FROM users
            LEFT JOIN profiles ON users.id = profiles.user_id
            WHERE users.email = $1`,
            [email]
        );

        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Successful login
        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                dateOfBirth: user.date_of_birth,
                country: user.country,
                location: user.city,
                bio: user.bio,
                interests: user.interested_in
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error while logging in"
        });
    }
});

// Get all user profiles
app.get("/profiles", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                users.id,
                profiles.first_name,
                profiles.last_name,
                profiles.date_of_birth,
                profiles.country,
                profiles.city,
                profiles.bio,
                profiles.interested_in
            FROM users
            JOIN profiles ON users.id = profiles.user_id
            ORDER BY users.id DESC
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Profiles error:", error);
        res.status(500).json({
            message: "Could not fetch profiles"
        });
    }
});

// Get one specific user profile
app.get("/profiles/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                users.id,
                profiles.first_name,
                profiles.last_name,
                profiles.date_of_birth,
                profiles.country,
                profiles.city,
                profiles.bio,
                profiles.interested_in
            FROM users
            JOIN profiles ON users.id = profiles.user_id
            WHERE users.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({
            message: "Could not fetch profile"
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

