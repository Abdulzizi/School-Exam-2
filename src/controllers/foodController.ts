import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getMenu = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allMenu = await prisma.food.findMany({
            where: {
                name: {
                    contains: search?.toString() || ""
                }
            }
        })

        if (allMenu.length === 0) {
            return res.json({
                status: false,
                message: "No menu found"
            })
        }

        return res.json({
            status: true,
            data: allMenu,
            message: `Menu found`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[GET FOOD] Something went wrong. ${error}`
        }).status(400)
    }
}

export const postFood = async (req: Request, res: Response) => {
    try {
        const { name, spicyLevel, price } = req.body

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (req.file) filename = req.file.filename /** get file name of uploaded file */

        /** process to save new food */
        const newFood = await prisma.food.create({
            data: {
                name,
                price: Number(price),
                spicy_level: spicyLevel,
                image: filename
            }
        })

        return res.json({
            status: true,
            data: newFood,
            message: `New food has created`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[POST FOOD] Something went wrong. ${error}`
        }).status(400)
    }
}

export const putFood = async (req: Request, res: Response) => {
    try {
        const { id } = req.params /** id dari parameter */
        const { name, spicyLevel, price } = req.body

        if (!id) {
            res.json({
                status: false,
                message: "ID required"
            }).status(400)
        }

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (req.file) filename = req.file.filename /** get file name of uploaded file */

        /** check data di db */
        const findFood = await prisma.food.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!findFood) return res.status(200).json({
            status: false,
            message: `Food is not found`
        })

        /** update admin data */
        const updatedFood = await prisma.food.update({
            where: { id: Number(id) },
            data: {
                name: name || findFood.name,
                spicy_level: spicyLevel || findFood.spicy_level,
                price: price || findFood.price,
                image: filename || findFood.image
            }
        })

        return res.json({
            status: true,
            data: updatedFood,
            message: `Food has updated`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[PUT Food] Something went wrong. ${error}`
        }).status(400)
    }
}

export const dropFood = async (req: Request, res: Response) => {
    try {
        const { id } = req.params /** id dari parameter */
        const findFood = await prisma.food.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!findFood) return res.status(200).json({
            status: false,
            message: `Food not found`
        })

        /** prepare to delete file of deleted egg's data */
        let path = `${BASE_URL}/public/food-image/${findFood.image}` /** define path (address) of file location */
        let exists = fs.existsSync(path)
        if (exists && findFood.image !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */

        /** delete food data */
        const deletedFood = await prisma.food.delete({
            where: {
                id: Number(id)
            }
        })

        return res.json({
            status: true,
            data: deletedFood,
            message: `Food has deleted`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[DROP Food] Something went wrong. ${error}`
        }).status(400)
    }
}