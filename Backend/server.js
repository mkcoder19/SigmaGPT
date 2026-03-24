import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/Auth.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use('/api' , chatRoutes);
app.use('/' , authRoutes);

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas Connected");
  }catch(err){
    console.error("Failed to connect DB:", err);
  }
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { details: err.message })
  });
});

app.listen(port, () => {
  console.log("App is listening on port", port);
  connectDB();
});

// Validate OpenAI key on startup
if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY not set in .env file. Add it to Backend/.env");
  process.exit(1);
}
