require("dotenv").config();
const express = require("express");
const cors = require("cors");
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_SERVICE_KEY);
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Connect to Supabase (use SERVICE ROLE KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

// 🔹 GET all assets
app.get("/assets", async (req, res) => {
  const { data, error } = await supabase.from("assets").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// 🔹 INSERT new asset
app.post("/assets", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const { data, error } = await supabase
    .from("assets")
    .insert([
      {
        latitude,
        longitude,
        type: "marker",
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data[0]);
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
