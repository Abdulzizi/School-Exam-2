import express from "express"
import { verifyToken } from "../middlewares/authorization"

import * as admin from "../controllers/adminController"
import * as midAdmin from "../middlewares/verifyAdmin"

const app = express()

app.use(express.json())

app.get(`/`, verifyToken, admin.getAdmin)

app.post(`/`, [verifyToken, midAdmin.verifyAddAdmin], admin.postAdmin)

app.put(`/:id`, [verifyToken, midAdmin.verifyEditAdmin], admin.putAdmin)

app.delete(`/:id`, verifyToken, admin.dropAdmin)

app.post(`/auth`, [midAdmin.verifyAuthentication], admin.authentication)

export default app