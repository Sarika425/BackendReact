const express = require("express");
const md5 = require("md5");
const router = express.Router();
const database = require("../database");

router.get("/", (req, res) => {
  res.json({ message: "Hello /auth" });
});

router.post("/signup", (req, res) => {
  const body = [req.body.name, req.body.email, md5(req.body.password)];

  const sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
  database.get(sql, body, (err, row) => {
    if (err) {
      res.status(500).json({
        status: "failed",
        message: "Unable to create user, Please try again.",
      });
      return;
    }
    res.json({
      status: "success",
      message: "User created successfully, Please login",
    });
  });
});

router.post("/signin", (req, res) => {
  const [email, password] = [req.body.email, req.body.password];

  const sql = "SELECT * FROM user WHERE email = ?";
  database.get(sql, [email], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({
        status: "failed",
        message: "Unable to signin, Please try again.",
      });
      return;
    }

    if (!row) {
      res.json({
        status: "failed",
        message: "Email not found, Please signup.",
      });
      return;
    }

    if (row.password == md5(password)) {
      res.json({
        status: "success",
        message: "User signed in successfully",
      });
    } else {
      res.json({
        status: "failed",
        message: "Incorrect Password, Please try again.",
      });
    }
  });
});

router.get("/users", (req, res) => {
  const sql = "SELECT id, name, email FROM user";
  database.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: "failed",
        message: "Unable to get users",
      });
      return;
    }

    res.json({
      users: rows,
    });
  });
});

router.put("/password_change", (req, res) => {
  const [id, email, password] = [
    req.query.user_id,
    req.query.email,
    req.body.password,
  ];
  const sql =
    "UPDATE user SET password = COALESCE(?,password) WHERE id = ? AND email = ?";
  database.run(sql, [md5(password), id, email], (err, result) => {
    if (err) {
      res.status(500).json({
        status: "failed",
        message: "Unable to change password, Please try again.",
      });
      return;
    }

    res.json({
      status: "success",
      message: "Password changed successfully",
    });
  });
});

module.exports = router;
