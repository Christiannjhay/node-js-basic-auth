import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticate from "../jwt-auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usernameCheck =
      await db`SELECT * FROM users WHERE username = ${username}`;

    if (usernameCheck.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      const result =
        await db`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword}) RETURNING *`;

      res.status(201).json(result[0]);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Error creating user" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db`SELECT * FROM users WHERE username = ${username}`;

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (await bcrypt.compare(password, user[0].password)) {
      const token = jwt.sign({ userId: user[0].id, username: user[0].username}, process.env.SECRET, { expiresIn: '1h' });

      res.cookie('authToken', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict', 
        maxAge: 3600000
      });

      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.get('/info', authenticate, (req, res) => {
  const userId = req.user.userId;
  const username = req.user.username;

  res.status(200).json({ userid: userId ,username: username });
});

export default router;
