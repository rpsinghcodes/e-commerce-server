const express = require("express");
const { validateJSONToken } = require("../utils/auth");
const router = express.Router();
const connection = require("../DB/db");


// for seller only
router.post("/addproduct", async (req, res) => {
    try {
      const {
        id,
        user_id,
        seller_id,
        title,
        description,
        price,
        category,
        image,
        sellerName,
      } = req.body;
      // validatingToken
      const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
      const isValid = validateJSONToken(token);
  
      if (isValid) {
        if (id) {
          // Update if id is provided
          // update if sellername and valid 
          
          const updateQuery = `UPDATE products SET title=?, description=?, price=?, category=?, image=?, created_at=NOW() WHERE seller_id= ? AND id=?`;
          const [updatedDataResult] = await connection
            .promise()
            .query(updateQuery, [title, description, price, category, image, seller_id,  id]);
  
            const [data] = await connection.promise().query(`SELECT * FROM products`);
            const [updatedSellerProducts] = await connection.promise().query(`select * from products where seller_id = ?`, [seller_id])
            
          
          res.status(200).json({
            success: true,
            message: "Product updated succesfully",
            data,
            updatedSellerProducts
          });
        } else {
          const query = `INSERT INTO products ( seller_id,  title, description, price, category, image, sellerName) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          await connection
            .promise()
            .query(query, [
              user_id,
              title,
              description,
              price,
              category,
              image,
              sellerName,
            ]);
            
            const [data] = await connection.promise().query(`SELECT * FROM products`);
            const [sellerProducts] = await connection.promise().query(`SELECT * FROM products where  seller_id = ?`, [user_id]);
          res.status(200).json({ sucess: true, message: "New Product Added.", data, sellerProducts });
        }
      } else {
        res.status(500).json({ message: "Invalid User." });
      }
    } catch (err) {
      // console.log('Error in Adding Product: ', err);
      if (err.errno === 1406) {
        res
          .status(400)
          .json({ success: false, message: "Upload small size photo" });
      } else {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Error in adding new Product." });
      }
    }
  });
  // for seller only
  router.post("/deleteproduct", async (req, res) => {
    try {
      const { id, seller_id } = req.body;
  
      const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
  
      const isValid = validateJSONToken(token);
      if (isValid) {
        await connection.promise().query(`DELETE FROM products WHERE id=? AND seller_id=?`, [id, seller_id]);
        const [data] = await connection.promise().query(`SELECT * FROM products`);
        const [sellerProducts] = await connection.promise().query(`SELECT * FROM products where  seller_id = ?`, [seller_id]);
        
        res
          .status(200)
          .json({ success: true, message: "Product Deleted succesfully.", data,  updatedSellerProducts: sellerProducts });
      }
      if (!isValid) {
        res.status(400).json({ success: false, message: "Invalid token id." });
      }
    } catch (err) {
      console.log("Error in Delete product.", err);
      res.status(500).json({ success: false, message: "Error in Delete product." });
    }
  });
  







module.exports = router;