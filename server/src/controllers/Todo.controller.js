import { validationResult } from "express-validator"; // Import validationResult function from express-validator
import { jsonGenerate } from "../utils/helpers.js"; // Import helper function for generating JSON responses
import { StatusCode } from "../utils/constants.js"; // Import status codes from constants
import Todo from "../models/Todo.js"; // Import Todo model
import User from "../models/User.js"; // Import User model

// Controller function to create a new todo
export const createTodo = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // If validation errors exist, return a validation error response
        return res.json(
            jsonGenerate(
                StatusCode.VALIDATION_ERROR,
                "Todo is required!",
                errors.mapped()
            )
        );
    }

    try {
        // Create a new todo using data from request body
        const result = await Todo.create({
            userId: req.userId, // Associate the todo with the current user
            desc: req.body.desc, // Description of the todo
        });

        if (result) {
            // If todo creation is successful, associate it with the user
            const user = await User.findOneAndUpdate(
                { _id: req.userId }, // Find the user by user ID
                { $push: { todos: result } } // Add the created todo to the user's todos array
            );

            // Send success response with the created todo
            return res.json(jsonGenerate(StatusCode.SUCCESS, "Todo Created Successfully!", result));
        }
    } catch (error) {
        // If an error occurs during todo creation or association, return an error response
        return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Something Went Wrong!", error));
    }
};
