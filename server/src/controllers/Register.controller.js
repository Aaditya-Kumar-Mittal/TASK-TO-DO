// Import necessary modules and dependencies
import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js"; // Import a helper function for generating JSON responses
import { StatusCode, JWT_TOKEN_SECRET } from "../utils/constants.js"; // Import status codes and JWT secret from constants
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import User from "../models/User.js"; // Import the User model
import Jwt from 'jsonwebtoken'; // Import JsonWebToken for generating tokens

// Register controller function
const Register = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        // No validation errors, proceed with registration
        //Koi error nahi aaya toh sare variables nikal lo using destructuring
        // Destructure request body for ease of use
        const { name, username, password, email } = req.body;

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt);

        // Check if user with the provided email or username already exists
        const userExist = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (userExist) {
            // If user exists, return an error response
            return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "User or E-mail already exists! Kindly login again!"));
        } else {
            // User does not exist, proceed with registration
            // Save user data to the database
            try {
                const result = await User.create({
                    name: name,
                    email: email,
                    password: hashPassword,
                    username: username
                });

                // Generate JWT token for the newly registered user
                const token = Jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET);

                // Send success response with user ID and token
                res.json(jsonGenerate(StatusCode.SUCCESS, "Registration Successfully Done!", { userId: result._id, token: token }));
            } catch (error) {
                // Catch any errors that occur during user creation
                console.log(error);
            }
        }
    } else {
        // If there are validation errors, return a validation error response
        res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "Validation Error Occurred!", errors.mapped()));
    }
}

// Export the Register controller function
export default Register;
