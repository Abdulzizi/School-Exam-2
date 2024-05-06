import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrderDetail = async (req: Request, res: Response) => {
    try {

        const orderDetail = await prisma.order_list.findMany({
            include: {
                order_detail: true
            }
        })

        if (orderDetail.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Order detail not found'
            });
        }

        return res.status(200).json({
            status: true,
            data: orderDetail,
            message: 'Order list found'
        });
    } catch (error) {
        console.error('Error getting order list:', error);
        return res.status(500).json({
            status: false,
            message: '[GET ORDER DETAIL] Internal server error'
        });
    }
};