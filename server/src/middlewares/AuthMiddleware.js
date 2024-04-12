import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Jwt from 'jsonwebtoken';

/**
 * Middleware function to authenticate incoming requests.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const AuthMiddleware = (req, res, next) => {
    // Check if the 'auth' header is present in the request
    if (req.headers['auth'] === undefined) {
        // If 'auth' header is not present, return an error response
        return res.json(jsonGenerate(StatusCode.AUTH_ERROR, "Access Denied!"));
    }

    // Extract the token from the 'auth' header
    const token = req.headers['auth'];

    try {
        // Verify the token using JWT and the secret key
        const decoded = Jwt.verify(token, JWT_TOKEN_SECRET);
        console.log(decoded);
        // Store the decoded user ID in the request object
        req.userId = decoded.userId;

        // Call the next middleware or route handler
        return next();

    } catch (error) {
        // If token verification fails, return an error response
        return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Invalid Token!"));
    }
};

export default AuthMiddleware;
