import express from "express";
import Register from "../controllers/Register.controller.js"; // Import Register controller
import { RegisterSchema } from "../validatonSchema/RegisterSchema.js"; // Import Register validation schema
import Login from "../controllers/Login.Controller.js"; // Import Login controller
import { LoginSchema } from "../validatonSchema/LoginSchema.js"; // Import Login validation schema
import { createTodo } from "../controllers/Todo.controller.js"; // Import createTodo controller
import { check } from "express-validator"; // Import check function from express-validator
import { GetTodos } from "../controllers/TodoList.controller.js"; // Import GetTodos controller
import { MarkTodo } from "../controllers/MarkTodo.controller.js"; // Import MarkTodo controller
import { RemoveTodo } from "../controllers/RemoveTodo.controller.js"; // Import RemoveTodo controller

// Create an instance of Express router for API routes
const apiRoute = express.Router();

// Create a separate instance of Express router for protected routes
export const apiProtected = express.Router();

// Define routes for registering and logging in users
apiRoute.post('/register', RegisterSchema, Register); // Route for user registration
apiRoute.post('/login', LoginSchema, Login); // Route for user login

// Define protected routes

// Route for creating todos
apiProtected.post(
    '/createTodo',
    [
        check("desc", "Todo Task description is required!").exists() // Validation middleware for todo description
    ],
    createTodo // Controller function for creating todos
);

// Route for fetching all the todolist for a user
apiProtected.get(
    '/todolist',
    GetTodos // Controller function for fetching all the todos for a user
);

// Route for marking a todo as completed
apiProtected.post(
    "/marktodo",
    [
        check("todo_id", "Todo Task id is required!").exists() // Validation middleware for todo id
    ],
    MarkTodo
);

// Route for deleting a todo
apiProtected.post(
    "/deleteTodo",
    [
        check("todo_id", "Todo Task id is required!").exists() // Validation middleware for todo id
    ],
    RemoveTodo
);

// Export the API routes
export default apiRoute;
