const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const db = require("../../database");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Create Submission
router.post("/", auth, upload.single("image"), (req, res) => {
  db.run(
    `INSERT INTO items (name, category, description, image, submittedBy) VALUES (?, ?, ?, ?, ?)`,
    [req.body.name, req.body.category, req.body.description, req.file ? req.file.filename : null, req.user.id],
    function (err) {
      if (err) return res.status(400).json({ message: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Public approved items
router.get("/", (req, res) => {
  db.all("SELECT * FROM items WHERE approved = 1 AND redacted = 0", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Filter by category
router.get("/category/:cat", (req, res) => {
  db.all(
    "SELECT * FROM items WHERE category = ? AND approved = 1 AND redacted = 0",
    [req.params.cat],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
});

// Pending
router.get("/pending", auth, role(["operator", "admin"]), (req, res) => {
  db.all("SELECT * FROM items WHERE approved = 0", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Approve
router.put("/approve/:id", auth, role(["operator", "admin"]), (req, res) => {
  db.run("UPDATE items SET approved = 1 WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Approved" });
  });
});

// Redact
router.put("/redact/:id", auth, role(["admin"]), (req, res) => {
  db.run("UPDATE items SET redacted = 1 WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Redacted" });
  });
});

// Delete
router.delete("/:id", auth, role(["operator", "admin"]), (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Deleted" });
  });
});

module.exports = router;
