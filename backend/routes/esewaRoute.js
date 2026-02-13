import express from 'express';
import authUser from '../middlewares/authUser.js';
import { checkEsewaStatus, esewaFailure, esewaSuccess, initiateEsewaPayment } from "../controllers/esewaController.js";

const esewaRouter=express.Router();

// initiate payment- requires logged in user
esewaRouter.post('/initiate', authUser, initiateEsewaPayment);

// success and failure redirects from eSewa  (NO auth - eSewa calls these directly)
esewaRouter.get('/success',esewaSuccess);
esewaRouter.get('/failure',esewaFailure);

// Manual status check
esewaRouter.get('/status/:transactionUuid',authUser,checkEsewaStatus);

export default esewaRouter;