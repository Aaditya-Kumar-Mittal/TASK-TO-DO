import { validationResult } from "express-validator"; // Import validationResult function from express-validator
import { jsonGenerate } from "../utils/helpers.js"; // Import helper function for generating JSON responses
import { StatusCode } from "../utils/constants.js"; // Import status codes from constants
import Todo from "../models/Todo.js"; // Import Todo model
import User from "../models/User.js"; // Import User model

// Controller function to remove a todo
export const RemoveTodo = async (req, res) => {
    // Validate the request using express-validator
    const error = validationResult(req);
    if (!error.isEmpty()) {
        // If validation errors exist, return a validation error response
        return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "Todo Id is required!", error.mapped()));
    }

    try {
        // Find and delete the todo item by userId and todo_id
        const result = await Todo.findOneAndDelete({
            userId: req.userId, // Filter by userId to ensure the todo belongs to the current user
            _id: req.body.todo_id, // Filter by todo_id to identify the todo item to delete
        });

        if (result) {
            // If the todo item is successfully deleted, remove its reference from the user's todos array
            const user = await User.findOneAndUpdate(
                { _id: req.userId }, // Filter by userId
                { $pull: { todos: req.body.todo_id } } // Pull the todo_id from the todos array
            );

            // Return success response with the deleted todo item
            return res.json(jsonGenerate(StatusCode.SUCCESS, "Task Successfully Deleted!", result));
        }
    } catch (error) {
        // If an error occurs during todo deletion, return an error response
        return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Task cannot be deleted!", null));
    }
}
