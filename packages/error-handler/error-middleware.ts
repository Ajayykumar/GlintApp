
import { AppError } from "./index.js";
import  { NextFunction, Request, Response } from 'express';
export const errorMiddleware = (err: Error, req: Request, res: Response, next:NextFunction) => {
    if (err instanceof AppError) {
        console.log(`Error: ${req.url}, ${req.method}-${err.message}`);
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            ...(err.details && { details: err.details }),
        })
    }
    console.log(`unhandled error: `, err);
    return res.status(500).json({
        error: "something went wrong please try again later.",
    })
}