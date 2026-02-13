import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import { getAllOrders, getUserOrders, placeOrderCOD } from '../controllers/orderController.js';

const orderRouter=express.Router();
orderRouter.post('/cod',authUser,placeOrderCOD);
orderRouter.post('/user', authUser, getUserOrders);   // change to POST method so body is available
orderRouter.get('/seller',authSeller,getAllOrders);
export default orderRouter;