// Import necessary modules and dependencies
import { validationResult } from "express-validator";
import User from "../models/User.js"; // Import the User model
import { jsonGenerate } from "../utils/helpers.js"; // Import a helper function for generating JSON responses
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js"; // Import JWT secret and status codes from constants
import bcrypt from 'bcrypt'; // Import bcrypt for password comparison
import Jwt from 'jsonwebtoken'; // Import JsonWebToken for generating tokens

// Login controller function
const Login = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        // No validation errors, proceed with login

        // Destructure username and password from request body
        const { username, password } = req.body;

        // Find user by username in the database
        const user = await User.findOne({ username: username });

        // Check if user exists
        if (!user) {
            // If user does not exist, return error response
            return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Username or password is incorrect!"));
        }

        // Verify password using bcrypt compareSync method
        const verified = bcrypt.compareSync(password, user.password);

        if (!verified) {
            // If password is incorrect, return error response
            return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Username or password is incorrect!"));
        }

        // Generate JWT token for the authenticated user
        const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET);

        // Send success response with user ID and token
        return res.json(jsonGenerate(StatusCode.SUCCESS, "Login Successful!", { userId: user._id, token: token }));
    }

    // If there are validation errors, return a validation error response
    res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "Validation Error Occurred!", errors.mapped()));
};

// Export the Login controller function
export default Login;
