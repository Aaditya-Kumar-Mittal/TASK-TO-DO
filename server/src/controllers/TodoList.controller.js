import User from "../models/User.js"; // Import the User model
import { StatusCode } from "../utils/constants.js"; // Import status codes from constants
import { jsonGenerate } from "../utils/helpers.js"; // Import helper function for generating JSON responses

// Controller function to retrieve all todos associated with a user
export const GetTodos = async (req, res) => {
    try {
        // Find the user by user ID and populate the 'todos' field
        const list = await User.findById(req.userId) // Find user by ID
            .select("-password") // Exclude the 'password' field from the query result
            .populate('todos') // Populate the 'todos' field with todo documents
            .exec(); // Execute the query

        // Return success response with the list of todos
        return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo list fetched!", list));
    } catch (error) {
        // If an error occurs during the database operation, return an error response
        return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Something went wrong!", error));
    }
}
