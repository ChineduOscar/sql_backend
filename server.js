import 'dotenv/config'
import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "rapidclient",
});

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log("Connected to the database.");
        connection.release();
        resolve();
      }
    });
  });
};

app.get("/", (req, res) => {
  res.json("hello");
});

app.post("/company", (req, res) => {
  const q = "INSERT INTO company(`companyName`, `companyEmail`, `companyIndustry`) VALUES (?)";

  const values = [
    req.body.companyName,
    req.body.companyEmail,
    req.body.companyIndustry,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(data);
  });
});

const PORT = process.env.PORT || 8800;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
