// -----------------------------
// 🌿 Moodscaping local proxy server
// -----------------------------

// 1️⃣ Import dependencies
// Express → creates the web server
// node-fetch → lets the server make HTTP requests (since "fetch" isn't built into Node by default)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

// 2️⃣ Initialize the app
const app = express();
const PORT = 3000; // You can change this if needed

// 3️⃣ Enable CORS so your front-end (e.g., http://127.0.0.1:5500) can call this server
app.use(cors());
app.use(express.static("public"));

// 4️⃣ Define a route that proxies requests to ZenQuotes
app.get("/", (req, res) => {
  res.send("🌿 Moodscaping Proxy Server is running! Try visiting /quote");
});

app.get("/quote", async (req, res) => {
  try {
    let response;
    const keyword = req.query.keyword;
    // parse keyword from query parameters
    if (keyword) {
      response = await fetch(`https://zenquotes.io/api/quotes?keyword=${keyword}`);
      console.log(`Received keyword: ${keyword}`);
    } else {
      console.log("No keyword provided, fetching random quote.");
      // Fetch a random quote from ZenQuotes API
      response = await fetch("https://zenquotes.io/api/random");
    }

    // Parse the response as JSON
    const data = await response.json();

    // Send that JSON back to the front-end
    res.json(data);
  } catch (error) {
    console.error("Error fetching quote from ZenQuotes:", error);

    // Return an error response with a 500 (Internal Server Error) status
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// 5️⃣ Start the server and listen on PORT
app.listen(PORT, () => {
  console.log(`Moodscaping proxy server running on http://localhost:${PORT}`);
});
