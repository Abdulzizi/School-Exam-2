import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** schema admin baru */
const addDetailSchema = Joi.object({
    food_id: Joi.number().min(1).required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required()
})

/** schema update admin */
const addDataSchema = Joi.object({
    customer_name: Joi.string().min(1).required(),
    table_number: Joi.string().min(1).required(),
    order_date: Joi.string().isoDate().required(),
    order_detail: Joi.array().items(addDetailSchema).min(1).required()
})

const updateDataSchema = Joi.object({
    customer_name: Joi.string().min(1).optional(),
    table_number: Joi.string().min(1).optional(),
    order_date: Joi.string().isoDate().optional(),
})

export const verifyAddOrder = (req: Request, res: Response, next: NextFunction) => {

    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        });
    }
    return next()
}

export const verifyEditOrder = (req: Request, res: Response, next: NextFunction) => {

    const { error } = updateDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(i => i.message).join()
        })
    }
    return next()
}
