import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allAdmin = await prisma.admin.findMany({
            where: {
                name: {
                    contains: search?.toString() || ""
                }
            }
        })

        if (allAdmin.length === 0) {
            return res.json({
                status: false,
                message: "No admin found"
            })
        }

        return res.json({
            status: true,
            data: allAdmin,
            message: `Admin found`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[GET ADMIN] Something went wrong. ${error}`
        }).status(400)
    }
}

export const postAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const newAdmin = await prisma.admin.create({
            data: {
                name, email, password: md5(password)
            }
        })

        if (!name || !email || !password) {
            res.json({
                status: false,
                message: "there are fields that must be filled in"
            }).status(400)
        }

        return res.json({
            status: true,
            data: newAdmin,
            message: `Admin has created`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[POST ADMIN] Something went wrong. ${error}`
        }).status(400)
    }
}

export const putAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params /** id dari parameter */
        const { name, email, password } = req.body

        if (!id) {
            res.json({
                status: false,
                message: "ID required"
            }).status(400)
        }

        if (!name || !email || !password) {
            res.json({
                status: false,
                message: "there are fields that must be filled in"
            }).status(400)
        }

        /** check data di db */
        const findAdmin = await prisma.admin.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!findAdmin) return res.status(200).json({
            status: false,
            message: `Admin is not found`
        })

        /** update admin data */
        const updatedAdmin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                name: name || findAdmin.name,
                email: email || findAdmin.email,
                password: password ? md5(password) : findAdmin.password
            }
        })

        return res.json({
            status: true,
            data: updatedAdmin,
            message: `Admin has updated`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[PUT ADMIN] Something went wrong. ${error}`
        }).status(400)
    }
}

export const dropAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params /** id parameter */

        /** check di db */
        const findAdmin = await prisma.admin.findFirst({ where: { id: Number(id) } })
        if (!findAdmin) return res.status(200).json({
            status: false,
            message: `Admin not found`
        })

        /** delete admin data */
        const deletedAdmin = await prisma.admin.delete({
            where: { id: Number(id) }
        })
        return res.json({
            status: true,
            data: deletedAdmin,
            message: `Admin has deleted`
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            message: `[DROP ADMIN] Something went wrong. ${error}`
        }).status(400)
    }
}

export const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        /** cari admin sesuai req */
        const findAdmin = await prisma.admin.findFirst({
            where: {
                email,
                password: md5(password)
            }
        })

        /** check admin */
        if (!findAdmin) return res.status(200).json({
            status: false,
            logged: false,
            message: `Username or password is invalid`
        })

        /** define payload to generate token */
        let payload = JSON.stringify(findAdmin)

        /** define key of generate token */
        let secretKey = process.env.JWT_SECRET_KEY

        /** generate token */
        let token = sign(payload, secretKey || "apalah")

        return res.status(200).json({
            status: true,
            logged: true,
            message: `Login Success`,
            token
        })
    } catch (error) {
        return res.json({
            status: false,
            message: `[AUTH ADMIN] Something went wrong. ${error}`
        }).status(400)
    }
}