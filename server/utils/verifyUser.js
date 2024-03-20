import jwt from "jsonwebtoken";
import {errorHandler} from "../utils/err.js"
 
export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "Please login first"));
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return next(errorHandler(403, "Invalid token"));
            } else {
                req.user = user;
                next();
            }
        });
    }
}