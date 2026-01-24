const express = require("express");
const fetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || "http://api:3000";

app.get("/health", (req, res) => res.json({ status: "ok", service: "client" }));

// Preuve de communication inter-services
app.get("/check-api", async (req, res) => {
  try {
    const r = await fetch(`${API_URL}/health`);
    const data = await r.json();
    res.json({ client: "ok", api_url: API_URL, api_response: data });
  } catch (e) {
    res.status(500).json({ client: "ok", api_url: API_URL, api_error: e.message });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`client-service running on ${PORT}`));
