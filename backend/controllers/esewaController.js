import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
// helper: Generate HMAC- SHA256 Signature

const generateSignature=(totalAmount,transactionUuid,productCode)=>{
    const secretKey=process.env.ESEWA_SECRET_KEY;
    const message= `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hash=crypto.createHmac('sha256', secretKey).update(message).digest('base64');
    return hash;
}

// generate unique transaction UUID

const generateTransactionUuid=()=>{
    const now=new Date();
const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // "20260213"
    const time = now.toISOString().slice(11, 19).replace(/:/g, ''); // "061732"
      return `${date}-${time}`;
};
//  INITIATE eSewa Payment: /api/esewa/initiate
// Called when user clicks "Proceed to Checkout" with Online Payment
// Returns payment parameters to frontend for form submission
export const initiateEsewaPayment=async (req,res) => {
    try{
        const {userId, items, address}=req.body;
         if (!userId) return res.json({ success: false, message: "User ID is required" });
        if (!address) return res.json({ success: false, message: "Address is required" });
        if (!items || items.length === 0) return res.json({ success: false, message: "Cart items are required" });

        // calculate total amount from items
        let amount=await items.reduce(async (accPromise, item) => {
            const acc= await accPromise;
            const product=await Product.findById(item.product);
            if(!product) throw new Error(`Product not found: ${item.product}`);
            return acc + product.offerPrice * item.quantity;            
        }, Promise.resolve(0));

        // Add 2% tax
        const taxAmount= Math.floor(amount*0.02);
        const totalAmount= amount+taxAmount;

        // generate unique transaction UUID
        const transactionUuid=generateTransactionUuid();

        const productCode= process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';

        // generate HMAC signature
        const signature= generateSignature(totalAmount,transactionUuid,productCode);

        // Save a PENDING order in database
        const order=await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentType: 'Online',
            isPaid:false,
            transactionUuid,  // store for verification later
        });

        // return all params needed for eSewa form submission
        return res.json({
            success:true,
            paymentParams:{
                amount:amount.toString(),
                tax_amount:taxAmount.toString(),
                total_amount:totalAmount.toString(),
                 transaction_uuid:transactionUuid,
                 product_code:productCode,
                  product_service_charge: '0',
                  product_delivery_charge: '0',
                  success_url: `${process.env.BACKEND_URL}/api/esewa/success`,
                failure_url: `${process.env.BACKEND_URL}/api/esewa/failure`,
                signed_field_names: 'total_amount,transaction_uuid,product_code',
                signature,
            },
            orderId:order._id,
            esewaUrl: process.env.ESEWA_PAYMENT_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
        });

    }catch(error){
         console.error('eSewa initiate error:', error.message);
        return res.json({ success: false, message: error.message });
    }
    
};

// SUCCESS HANDLER: /api/esewa/success
// eSewa redirects here after successful payment with base64 encoded data

export const esewaSuccess = async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=No response data`);
        }

        // Decode base64 response from eSewa
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

        console.log('eSewa decoded response:', decodedData); // ADD THIS LOG

        const {
            transaction_code,
            status,
            total_amount,
            transaction_uuid,
            product_code,
            signed_field_names,
            signature: receivedSignature,
        } = decodedData;

        console.log('Verifying signature with:', {  // ADD THIS LOG
            total_amount,
            transaction_uuid,
            product_code,
            receivedSignature
        });

        // ✅ FIX: Use exact values from eSewa response for signature verification
        // eSewa signs using the signed_field_names order
        const fieldNames = signed_field_names.split(',');
        const signatureMessage = fieldNames
            .map(field => `${field}=${decodedData[field]}`)
            .join(',');

        console.log('Signature message:', signatureMessage); // ADD THIS LOG

        const secretKey = process.env.ESEWA_SECRET_KEY;
        const expectedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(signatureMessage)
            .digest('base64');

        console.log('Expected signature:', expectedSignature); // ADD THIS LOG
        console.log('Received signature:', receivedSignature); // ADD THIS LOG

        if (expectedSignature !== receivedSignature) {
            console.error('Signature mismatch!');
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Invalid signature`);
        }

        if (status !== 'COMPLETE') {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Payment not complete`);
        }

        // Find and update the pending order
        const order = await Order.findOneAndUpdate(
            { transactionUuid: transaction_uuid },
            {
                isPaid: true,
                transactionCode: transaction_code,
                status: 'Order Placed',
            },
            { new: true }
        );

        if (!order) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Order not found`);
        }

        return res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`);

    } catch (error) {
        console.error('eSewa success handler error:', error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=${error.message}`);
    }
};
//  FAILURE HANDLER: /api/esewa/failure
// eSewa redirects here when payment fails or user cancels
export  const esewaFailure = async (req, res) => {
    try {
        const { data } = req.query;

        if (data) {
            // Try to decode and mark the order as failed
            const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
            const { transaction_uuid } = decodedData;

            if (transaction_uuid) {
                // Delete the pending order since payment failed
                await Order.findOneAndDelete({ transactionUuid: transaction_uuid, isPaid: false });
            }
        }

        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);

    } catch (error) {
        console.error('eSewa failure handler error:', error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

};
// STATUS CHECK: /api/esewa/status/:transactionUuid
// Manual status check if redirect fails (per eSewa docs recommendation)

export const checkEsewaStatus = async (req, res) => {
    try {
        const { transactionUuid } = req.params;

        const order = await Order.findOne({ transactionUuid });
        if (!order) return res.json({ success: false, message: 'Order not found' });

        const productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const statusUrl = process.env.ESEWA_STATUS_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/';

        // Call eSewa status check API
        const response = await fetch(
            `${statusUrl}?product_code=${productCode}&total_amount=${order.amount}&transaction_uuid=${transactionUuid}`
        );
        const statusData = await response.json();

        if (statusData.status === 'COMPLETE') {
            await Order.findOneAndUpdate(
                { transactionUuid },
                { isPaid: true, status: 'Order Placed' }
            );
            return res.json({ success: true, message: 'Payment verified', status: 'COMPLETE' });
        }

        return res.json({ success: false, status: statusData.status, message: 'Payment not complete' });

    } catch (error) {
        console.error('eSewa status check error:', error.message);
        return res.json({ success: false, message: error.message });
    }
};


