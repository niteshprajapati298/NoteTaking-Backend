import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import dotenv from 'dotenv'
import noteRouter from "./routes/note";
import cors from 'cors'


const app = express();
const PORT = 5000;
import cookieParser from "cookie-parser";
app.use(cors({
  origin: ['http://localhost:5173','https://note-taking-web-beta.vercel.app'], 
  credentials: true,
  optionsSuccessStatus: 200
}));

dotenv.config()

app.use(express.json());
app.use(cookieParser());
app.use('/auth',authRouter)
app.use('/notes',noteRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express ");
});
connectDB().then(()=>{
  app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
console.log("Database Connection Established")
})
