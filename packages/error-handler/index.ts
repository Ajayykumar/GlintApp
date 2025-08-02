export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details: any;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, details?: any, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);  // This will include the stack trace of the caller function in the error object.
    }
}

//not found error

export class NotFoundError extends AppError {
    constructor(message: "Resource not found") {
        super(message, 404);
    }
}

// validation error (use the "joi/zod/react-hook-form" library for this)

export class ValidationError extends AppError {
    constructor(
        message: string = "Invalid request data",
        details: any = null
    ) {
        super(message, 400, details, true);
    }
}

export class authError extends AppError {
    constructor(message: "unauthorizes") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: "Forbidden access") {
        super(message, 403);
    }
}

export class dataBaseError extends AppError {
    constructor(message: "Database error", details?: any) {
        super(message, 500, true, details); 
    }
}

export class rateLimitError extends AppError {
    constructor(message: "Too many requests, please try again later.") {
        super(message, 429);
    }
}