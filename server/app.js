const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Resume Analyzer API 0.1",
  });
});

module.exports = app;