import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const validateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Schema = Joi.object({
            title: Joi.string().min(1).max(120).required(),
            description: Joi.string().allow('')
        });

        await Schema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateTask;