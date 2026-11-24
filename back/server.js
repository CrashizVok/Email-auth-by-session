const express = require("express");
const knex = require("knex");
const app = express();
const PORT = 3000;
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const db = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "users",
  },
});

// POST /login

app.post("/api/login", async (req, res) => {
  const { email = "", password = "" } = req.body;

  try {
    const users = await db("users")
      .select("id", "name", "email", "password")
      .where({ email, password });

    console.log("result", users);

    if (users.length > 0) {
      const sessionLifeDays = 1;
      const expires = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * sessionLifeDays,
      );

      const insertResult = await db("sessions").insert({
        name: "loggedIn",
        value: "true",
        expires,
        user_id: users[0].id,
      });

      return res.status(200).json({
        loggedIn: true,
        message: "Logged in!",
        select_result: users,
        insert_result: insertResult,
      });
    } else {
      return res.status(401).json({
        loggedIn: false,
        message: "Bad email or password.",
        result: users,
      });
    }
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email = "" } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const users = await db("users").select("id", "email").where({ email });

    if (users.length > 0) {
      console.log("Password reset requested for:", email);
    }

    return res.status(200).json({
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) =>
  res.status(404).json({
    error: "Not Found",
  }),
);

app.listen(PORT, (error) => {
  if (error) console.warn(error);
  else console.log("Running on port: ", PORT);
});
