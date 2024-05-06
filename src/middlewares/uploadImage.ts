import { Request } from "express";
import multer from "multer";
import path from "path";
import { BASE_URL } from "../global";

/** define storage  */
const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** define location of uploaded image, make sure that you have create a "public" folder in root folder.
         * then create folder "egg-image" inside of "public folder"
         */
        cb(null, `${BASE_URL}/public/food-image/`)
    },
    filename: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** define file name of uploaded file */
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }, 
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, /** define max size of uploaded file, in this case max size is 2 MB */
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
})

export default uploadFile