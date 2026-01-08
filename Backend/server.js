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
    console.log("Failed to connect DB",err);
  }
}

app.listen(port, () => {
  console.log("App is listening");
  connectDB();
});
