import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
});

const todoSchema = new mongoose.Schema({
    task: {type: String},
    completion: {default: false, type: Boolean},
    userId: {type: mongoose.Schema.ObjectId, ref: "User"}
});

export const userModel = mongoose.model("User", userSchema);
export const todoModel = mongoose.model("Todo", todoSchema);