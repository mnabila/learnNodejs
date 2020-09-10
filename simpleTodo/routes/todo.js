require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});
db.connect();

router.get("/", function (req, res) {
  db.query("select * from todo", (error, result) => {
    res.json({
      code: 200,
      data: result,
    });
  });
});

router.get("/:todoId", function (req, res) {
  db.query("select * from todo where id=?", [req.params.todoId], (error, result) => {
    res.json({
      code: 200,
      data: result,
    });
  });
});

router.post("/", function (req, res) {
  const todo = req.body.todo;
  if (todo) {
    db.query("insert into todo(teks) values(?)", [todo], (error, result) => {
      if (error) {
        res.json({
          code: 403,
          message: error.sqlMessage,
        });
      }
      res.json({
        code: 200,
        message: "todo sukses ditambahkan",
      });
    });
  }
});

router.put("/:todoId", function (req, res) {
  const todo = req.body.todo;
  if (todo) {
    db.query("update todo set teks=?, updated=? where id=?", [todo, new Date(), req.params.todoId], (error, result) => {
      if (error) {
        res.json({
          code: 403,
          message: error.sqlMessage,
        });
      }
      if (result.changedRows) {
        res.json({
          code: 200,
          message: "todo sukses diperbaharui",
        });
      }
    });
  }
});

router.delete("/:todoId", function (req, res) {
  db.query("delete from todo where id=?", [req.params.todoId], (error, result) => {
    res.json({
      code: 200,
      message: "todo sukses dihapus",
    });
  });
});

module.exports = router;
