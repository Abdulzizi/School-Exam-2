import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** schema admin baru */
const addDataSchema = Joi.object({
    name: Joi.string().min(1).required(),
    spicyLevel: Joi.string().required(),
    price: Joi.string().min(0).required(),
    image: Joi.string().optional()
})

/** schema update admin */
const updateDataSchema = Joi.object({
    name: Joi.string().min(1).optional(),
    spicyLevel: Joi.string().optional(),
    price: Joi.string().min(0).optional(),
    image: Joi.string().optional(),
})

export const verifyAddFood = (req: Request, res: Response, next: NextFunction) => {

    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        });
    }
    return next()
}

export const verifyEditFood = (req: Request, res: Response, next: NextFunction) => {

    const { error } = updateDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        })
    }
    return next()
}
