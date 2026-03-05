const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../database");

router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [req.body.username, hashed],
      function (err) {
        if (err) return res.status(400).json({ message: "User already exists" });
        res.json({ message: "User created" });
      }
    );
  } catch {
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", (req, res) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [req.body.username],
    async (err, user) => {
      if (err || !user)
        return res.status(400).json({ message: "Invalid credentials" });

      const valid = await bcrypt.compare(req.body.password, user.password);
      if (!valid)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
      );

      res.json({ token, role: user.role });
    }
  );
});

module.exports = router;