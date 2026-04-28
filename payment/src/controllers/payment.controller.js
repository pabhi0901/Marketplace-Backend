import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()
import Razorpay from 'razorpay'
import paymentModel from './../models/payment.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createPayment = async(req,res)=>{

    console.log(process.env.RAZORPAY_KEY_ID)
    console.log(process.env.RAZORPAY_KEY_SECRET);
    
    
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    const {orderId} = req.params

    const order = await axios.get(`http://localhost:5004/orders/${orderId}`,{
       
      headers: {
                Authorization: `Bearer ${token}`
              }
    }).then((res)=>res.data.order)

    console.log(order);
    

    const price = order.totalAmount

    try {
    
    const razorPayOrder = await razorpay.orders.create(price);


    const newPayment = await paymentModel.create({
      order: order._id,
      price,
      status: 'PENDING',
      user:order.userId
    });

      res.send(razorPayOrder);
  
    } 
  catch (error) {
    res.status(500).send('Error creating order');
    console.log(error);
  }



}


const verifyPayment = async(req,res)=>{

  const { razorpayOrderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try{

  const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils.js')

    
  const isValid = validatePaymentVerification({
                      
                    order_id: razorpayOrderId,
                      payment_id: paymentId
                    },  signature, secret)

  if (!isValid) {
            return res.status(400).json({ message: 'Invalid signature' });
  }

  const payment = await paymentModel.findOne({ razorpayOrderId, status: 'PENDING' });

  if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
  }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'COMPLETED';

          await payment.save();

  res.status(200).json({ message: 'Payment verified successfully', payment });




  }catch(err){

    console.log("Error in payment verifying");
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });

  }

}

export {createPayment,verifyPayment}