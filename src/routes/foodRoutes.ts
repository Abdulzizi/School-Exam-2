import express from "express"

import * as food from "../controllers/foodController"
import { verifyToken } from "../middlewares/authorization" 
import uploadFile from "../middlewares/uploadImage"

const app = express()

app.use(express.json())

app.get(`/`, food.getMenu)

app.post(`/`, [verifyToken, uploadFile.single("image")], food.postFood)

app.put(`/:id`, [verifyToken, uploadFile.single("image")], food.putFood)

app.delete(`/:id`, verifyToken, food.dropFood)

export default app