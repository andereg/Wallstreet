// Use "import" instead of "require"
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api.infomaniak.com/1/ai/103319/openai/chat/completions";
const API_KEY = process.env.INFOMANIAK_API_KEY;

app.post("/api/generate-todo", async (req, res) => {
  try {
    const response = await axios.post(API_URL, req.body, {
      headers: {
        Authorization: `Bearer EfTbZ7l4kMMZ9qmi7RWqf4QEHn7rcsHkc2K8jUfn6Ou3OKxNVUJkwDqY0870doXt3qaQR_mmNjC-L4C_`,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));