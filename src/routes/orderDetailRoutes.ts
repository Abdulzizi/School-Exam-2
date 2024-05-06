import express from 'express';
import * as orderDetail from '../controllers/orderDetailController';
import { verifyToken } from "../middlewares/authorization"

const app = express();

app.use(express.json())

app.get('/', verifyToken, orderDetail.getOrderDetail);

export default app