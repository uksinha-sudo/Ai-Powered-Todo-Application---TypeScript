import { Router } from "express";
import { todoModel, userModel } from "../db.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { userMiddleware } from "../middleware.js";
const JWT_SECRET = process.env.JWT_SECRET;
export const userRouter = Router();

userRouter.post("/signup", async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try{

        if(email === undefined) {
            return res.status(404).send({
                message:"Email can't be empty"
            })
        }

        const existingUser = await userModel.findOne({
            email
        });
        
        if(existingUser){
            res.status(409).send({
                message: "Email already in use"
            })
            return;
        }

        const existingUsername = await userModel.findOne({
            username
        });

        if(existingUsername){
            res.status(409).send({
                message: "Username already exists, try another username"
            })
            return;
        };
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await userModel.create({
            username, email, password: hashedPassword
        });
        
        res.send({
            message: "Account Created"
        });
    } catch(error){
        console.log(error);
        res.status(500).send({message: "Internal server error, Failed to created account, please try again later"})
    }

});

userRouter.post("/signin", async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{

        const existingUser = await userModel.findOne({
            email
        });
        
        if(!existingUser) {
            res.status(404).send({
                message: "User not found"
            })
            return;
        }
        
        const checkPassword = await bcrypt.compare(password, existingUser.password);
        
        if(!checkPassword){
            res.status(401).send({
                message: "Incorrect Credentials"
            });
            return;
        }
        
        if(JWT_SECRET === undefined) {
            console.log("jwt secret is null")
            return;
        } 
        
        const token = jwt.sign({
            id: existingUser._id.toString()
        }, JWT_SECRET);
        
        res.send({
            message:"User logged in",
            token: token
        });
    } catch(error) {
        console.log(error);
        res.status(500).send({message:"Internal server error, failed to sign up"})
    }

});

userRouter.get("/profile", userMiddleware, async(req, res) => {
    const userId = req.userId;
    try{

        const user = await userModel.findOne({
            _id: userId
        });
        
        res.send({
            user
        });
    } catch(error) {
        return res.status(500).send({message: "Server error, Failed to get user profile"});
    }
});

userRouter.put("/update", userMiddleware, async(req, res) => {
    const username = req.body.username;
    const email = req.body.emai;
    const password = req.body.password;
    try{

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const updatedUser = await userModel.findOneAndUpdate(
            {_id: req.userId},
            {username, email, password: hashedPassword},
            {returnDocument: 'after'}
        )
        if(!updatedUser) {
            return res.json({
                message: "Failed to find user"
            });
        } else {
            res.send({
                message: "updated info",
                updatedUser
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send({message: "Server error, failed to update user's information"})
    }
});

userRouter.delete("/delete", userMiddleware, async(req, res) => {
    try{
        const deleteUser = await userModel.findOneAndDelete({
            _id: req.userId
        });

        const deleteTasks = await todoModel.deleteMany({
            userId: new mongoose.Types.ObjectId(req.userId)
        });
        
        res.send({
            message:"User Account deleted",
            deleteUser,
            deleteTasks
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send({message:"Server error, failed to delete user"})
    }
});