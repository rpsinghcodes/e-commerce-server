const express = require("express");
const { validateJSONToken } = require("../utils/auth");
const router = express.Router();
const connection = require("../DB/db");


// for user only
router.post("/add-to-whishlist", async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
      const isValid = validateJSONToken(token);
      const { user_id, product_id } = req.body;
      if (isValid) {
        const [data] = await connection
          .promise()
          .query(
            `SELECT * FROM userwishlist WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
          );
  
        if (data.length > 0) {
          const [findProduct_id] = await connection
          .promise()
          .query(`SELECT product_id FROM userwishlist WHERE user_id = ?`, [user_id]);
          const productArray = findProduct_id.map((item) => item.product_id);
          const idsString = productArray.join(", ");
          const query = `SELECT * FROM products WHERE id IN (${idsString})`;
        
          const [products] = await connection.promise().query(query);
          res.status(200).json({ success: true, message: "Already added in Wish List.", updatedWishList: products });
        }
        if (data.length === 0) {
          await connection
            .promise()
            .query(
              `INSERT INTO userwishlist (user_id, product_id, created_at) VALUES (?, ?, ?)`,
              [user_id, product_id, new Date()]
            );
            const [findProduct_id] = await connection
        .promise()
        .query(`SELECT product_id FROM userwishlist WHERE user_id = ?`, [user_id]);
        const productArray = findProduct_id.map((item) => item.product_id);
        const idsString = productArray.join(", ");
        const query = `SELECT * FROM products WHERE id IN (${idsString})`;
      
        const [products] = await connection.promise().query(query);
            
          res.status(200).json({success: true, message: "Product added in wishList", updatedWishList: products });
        }
      } else {
        res.status(401).json({ success: false, message: "User Not loged in." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error in add-to-whishlist" });
    }
  });
  
  // for user only
  router.post("/wishlist", async (req, res) => {
    try {
      const { user_id } = req.body;
      const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
      const isValid = validateJSONToken(token);
    
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Invalid User." });
      }
    
      const [product_id] = await connection
        .promise()
        .query(`SELECT product_id FROM userwishlist WHERE user_id = ?`, [user_id]);
    
      if (product_id.length === 0) {
        return res.status(200).json({ message: "No products found." });
      }
    
      const productArray = product_id.map((item) => item.product_id);
      const idsString = productArray.join(", ");
      const query = `SELECT * FROM products WHERE id IN (${idsString})`;
    
      const [products] = await connection.promise().query(query);
    
      res.status(200).json({ products });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: "Error in Wishlist" });
    }
    
  });
  








module.exports = router