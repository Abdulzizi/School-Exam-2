import express from "express";

import adminRoute from "./routes/adminRoutes";
import foodRoute from "./routes/foodRoutes";
import orderListRoutes from './routes/orderListRoutes';
import orderDetailRoutes from "./routes/orderDetailRoutes"

const PORT: number = 3000;
const app = express();

app.use("/admin", adminRoute)
app.use("/food", foodRoute)
app.use("/order", orderListRoutes)
app.use("/orderDetail", orderDetailRoutes)

app.listen(PORT, () => console.log(`Server run on port ${PORT}`))