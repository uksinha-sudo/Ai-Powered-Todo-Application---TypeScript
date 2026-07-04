import { Router } from 'express';
import { userMiddleware } from '../middleware.js';
import { todoModel } from '../db.js';
import mongoose from 'mongoose';

export const todoRouter = Router();

todoRouter.post("/create", userMiddleware, async (req, res) => {
    const task = req.body.task;
    const completion = req.body.completion;
    const userId = new mongoose.Types.ObjectId(req.userId)
    try {

        const addedTask = await todoModel.create({
            task,
            completion,
            userId
        });

        res.json({
            message: "Task added",
            addedTask
        });

    } catch (error) {
        res.status(500).send({ message: "server error, failed to add task" })
    }
});

todoRouter.get("/task/:taskId", userMiddleware, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const getTask = await todoModel.findOne({
            _id: taskId,
        });

        res.status(200).send({
            success: true,
            getTask
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error, failed to get task"
        })
    }
});

todoRouter.delete("/delete/:taskId", userMiddleware, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await todoModel.findOneAndDelete({
            _id: taskId
        });

        res.status(200).send({
            success: true,
            deletedTask,
            message:"Task Deleted"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error, failed to delete task"
        })
    }
});

todoRouter.get("/tasks", userMiddleware, async(req, res) => {
    try{

        const userId = new mongoose.Types.ObjectId(req.userId);
        
        const allTaks = await todoModel.find({
            userId
        });
        
        res.send({
            allTaks
        })
    }catch(error) {
        return res.status(500).send({message: "server error, failed to get tasks"})
    }
});

todoRouter.put("/update/:todoId", userMiddleware, async(req, res) => {
    const completion = req.body.completion;
    const todoId = req.params.todoId;
    try{

        const updatedTask = await todoModel.findByIdAndUpdate(
            {_id: todoId},
            { completion},
            {new: true}
        );
        
        res.status(200).send({
            message:"Updated task",
            updatedTask
        })
    }catch(error) {
        return res.status(500).send({
            message:"Server error, failed to update task"
        })
    }
});