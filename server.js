const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 4018;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Route to fetch data with optional 'name' filter
app.get("/api/data/:name?", async (req, res) => {
  const { name } = req.params;

  // If no 'name' filter is provided, return an error
  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }

  try {
    // If the 'name' filter is provided, proceed with fetching data
    const apiUrl = `https://leger.rahulluthra.in/api/tasks/d?name=${encodeURIComponent(
      name
    )}`;
    const response = await axios.get(apiUrl);
    let transactionsData = response.data;

    res.json(transactionsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Catch-all route for any invalid pages like '/'
// This will return a custom error or redirect the user
app.get("/", (req, res) => {
  res.status(404).json({
    error: "Invalid request, please specify a valid filter like /?name=rovin",
  });
});

// Serve the index.html file for any other route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
