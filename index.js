const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const db = require('./DB/db');

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require('./routes/order');
app.use(bodyParser.json({limit:'50mb'}));

app.use(cors());

app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes);


app.get("/",async (req, res) => {
  try { 
    const [data] = await db.promise().query(`SELECT * FROM PRODUCTS`);
    res.status(200).json({success: true, data});
  }catch(err) {
    res.status(500).json({success: false, message: "Error in getting the products."})
  }
});

// send an individual product details
app.get("/product/:id", async (req, res) => {
  try {
    const {id} = req.params;
    
    const [productDetail] = await db.promise().query(`SELECT * FROM PRODUCTS WHERE id = ? `, [id]);
    
    res.status(200).json({success: true, productDetail});
  }catch(err) {
    console.log(err);
    res.status(500).json({success: false, message: "Error in getting the individual product"})
  }
});

app.get('/productby/:sellerName', async (req, res) => {
  try {
    const {sellerName} = req.params;
    const [productDetail] = await db.promise().query(`SELECT * FROM PRODUCTS WHERE sellerName = ? `, [sellerName]);
    
    res.status(200).json({success: true, productDetail});
  }catch(err) {
    console.log(err);
    console.log('err: ', err)
    res.status(500).json({success: false, message: "Error in getting the individual product"})
  }
})

app.listen(4000, () => {
  console.log("App is running on port 4000.");
});
