var express = require("express");
var router = express.Router();
const supabase = require("../config/supabase");

router.get("/", async function (req, res) {
  const { data, error } = await supabase.from("assets").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

router.post("/", async function (req, res) {
  const { lat, lng } = req.body;

  const { data, error } = await supabase.from("assets").insert([
    {
      type: "New Asset",
      zone: "Auto",
      latitude: lat,
      longitude: lng,
      condition: "Good",
    },
  ]);

  if (error) return res.status(500).json(error);

  res.json(data);
});

module.exports = router;
