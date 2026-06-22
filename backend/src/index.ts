import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRouter } from './routes/userRoute.js';
import { todoRouter } from './routes/todoRoute.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);

async function connectToDB(){
    const Mongo_url = process.env.MONGO_URL;
    const PORT = process.env.PORT;
    try{

        if(!Mongo_url){
            throw new Error("Mongo URL not found")
        }
        
        await mongoose.connect(Mongo_url);
        app.listen(PORT, () => {
            console.log("SERVER STARTED AT", new Date().toISOString());
            console.log(`Connected to Database, Server is now listening on port ${PORT}`);
        })
    } catch(error){
        console.log(error);
    }
}

connectToDB();