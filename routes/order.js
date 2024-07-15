const express = require("express");
const { validateJSONToken } = require("../utils/auth");
const router = express.Router();
const connection = require("../DB/db");


router.post("/order", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
    const isValid = validateJSONToken(token);
    const userId = isValid.data[0].id;
    console.log('isValid: ', userId);
    const { data } = req.body;
    // console.log(data);
    console.log("data.info: ", data.info);
    const { name, mobileNumber, pincode, address, modeOfPayment } = data.info;
    
   data?.product.map(async (p) => {
      const query = `INSERT INTO orders (product_id, seller_id, product_name, product_quantity, product_price, order_price, modeOfPayment, address, pincode, user_name, userMobileNumber, orderStatus, user_id ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await connection
        .promise()
        .query(query, [
          p.product_id,
          p.seller_id,
          p.product_name,
          p.quantity,
          p.price,
          p.price * p.quantity,
          modeOfPayment,
          address,
          pincode,
          name,
          mobileNumber,
          "Not Yet Dispatched",
          userId
        ]);
    });
 

    // remove all the products in the cart where useId match
    const query = `DELETE FROM usercart WHERE user_id = ?`;
    const [deletedCart] =  await connection.promise().query(query, [userId]);
    const [userOrders] = await connection.promise().query(`SELECT * FROM orders where user_id = ? `, [userId]);

    res.status(200).json({ success: true, message: "Ordered Succesfully.", deletedCart, userOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in order." });
    console.log(err);
  }
});

router.post('/update-order', async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
    const isValid = validateJSONToken(token);
    const {orderId} = req.body;
    console.log('req.body: ', req.body);
    console.log(isValid);
    const sellerId = isValid.data[0].id
    console.log('sellerId', sellerId)
    console.log('orderId: ', orderId);
    await connection.promise().query(`UPDATE orders SET orderStatus='Shipped' WHERE order_id= ? AND seller_id= ? `, [orderId, sellerId]);
    const [data] = await connection.promise().query(`SELECT * FROM orders WHERE seller_id = ? `, [sellerId]);
    res.status(200).json({success: true, message: isValid, data});
  }catch(err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error in Updating Your Order."})
  }
})

router.get("/order/token/:token/seller_id/:seller_id", async (req, res) => {
  try {
    const { token, seller_id } = req.params;
    const isValid = validateJSONToken(token);
    if (!isValid) {
       res.status(404).json({ success: false, message: "Access Denied" });
    } else {
      console.log(`token: ${token}\nseller_id: ${seller_id}`);
      const [data] = await connection
        .promise()
        .query(`SELECT * FROM orders  WHERE seller_id=?;`, [seller_id]);
      console.log(data);
      res.status(200).json({ success: true, message: "Access Granted", data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error in order." });
  }
});

router.get("/my-order/:token", async (req, res) => {
  try {
    const {token} = req.params;
    const isValid = validateJSONToken(token);
    if(!isValid) {
      res.status(404).json({success: true, message: "Access Denied", data: []})      
    } else {      
      const userId = isValid.data[0].id;
      const [data] = await connection.promise().query(`SELECT * FROM orders where user_id = ? `, [userId]);
      return res.status(200).json({success: true, message: "Access Granted", data})
    }
  }catch(err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error in orders."})
  }
})

router.get('/track-order/:orderId/:mobileNumber', async (req, res) => {
  try {
    const {orderId, mobileNumber} = req.params;
    const [orderInfo] = await connection.promise().query(`SELECT orderStatus FROM orders WHERE order_id=? AND userMobileNumber=?`, [orderId, mobileNumber]);
    if(orderInfo.length === 0) {
      res.status(200).json({success: true, message: "Invalid Order Id and Mobile Number"})
    }if(orderInfo.length > 0) {
      res.status(200).json({success: true, message: orderInfo[0].orderStatus});
    }
  }catch(err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error in Tracking Your Order."})
  }
})


module.exports = router;
