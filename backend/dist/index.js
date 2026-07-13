import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRouter } from './routes/userRoute.js';
import { todoRouter } from './routes/todoRoute.js';
dotenv.config();
const app = express();
app.use(express.json());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://ai-powered-todo-application-ten.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
].filter(Boolean);
console.log('Allowed CORS origins:', allowedOrigins);
app.use(cors({
    origin: (origin, callback) => {
        console.log('CORS request from origin:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);
async function connectToDB() {
    const Mongo_url = process.env.MONGO_URL;
    const PORT = process.env.PORT || 3000;
    try {
        if (!Mongo_url) {
            throw new Error("Mongo URL not found");
        }
        await mongoose.connect(Mongo_url);
        app.listen(PORT, () => {
            console.log("SERVER STARTED AT", new Date().toISOString());
            console.log(`Connected to Database, Server is now listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
connectToDB();
//# sourceMappingURL=index.js.map