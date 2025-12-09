import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/exchange", async (req, res) => {
  const { code } = req.body;

  const response = await fetch("https://unsplash.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.UNSPLASH_CLIENT_ID,
      client_secret: process.env.UNSPLASH_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      code,
      grant_type: "authorization_code"
    })
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Backend listo en http://localhost:3000"));

