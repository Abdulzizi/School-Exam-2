import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const header = request.headers.authorization 

        if (header) {
            let [key, token] = header.split(" ") /** split header's value and take token */

            const secret = process.env.JWT_SECRET_KEY || "" /** call secret key of jwt */

            if(verify(token, secret)){
                return next()
            }
        }

        /** this code will be run if token is not verified */
        return response
            .json({
                status: false,
                message: `Unauthorized. Please include verified token`
            })
            .status(401)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}