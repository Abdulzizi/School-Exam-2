import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** schema admin baru */
const addDataSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
})

/** schema update admin */
const updateDataSchema = Joi.object({
    name: Joi.string().min(1).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().optional(),
})

/** schema auth */
const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
})

export const verifyAddAdmin = (req: Request, res: Response, next: NextFunction) => {

    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        });
    }
    return next()
}

export const verifyEditAdmin = (req: Request, res: Response, next: NextFunction) => {

    const { error } = updateDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        })
    }
    return next()
}

export const verifyAuthentication = (req: Request, res: Response, next: NextFunction) => {

    const { error } = authSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        })
    }
    return next()
}