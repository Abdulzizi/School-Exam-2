import express from 'express';
import * as orderList from '../controllers/orderListController';
import { verifyToken } from "../middlewares/authorization"
import * as middle from "../middlewares/verifyOrder"

const app = express();

app.use(express.json())

app.get('/', orderList.getOrderList);

app.post('/', middle.verifyAddOrder, orderList.createOrderList)

app.get('/:id', orderList.getOrderListById);

app.put('/:id', middle.verifyEditOrder, orderList.updateOrderList);

app.delete('/:id', orderList.deleteOrderList);

export default app;
