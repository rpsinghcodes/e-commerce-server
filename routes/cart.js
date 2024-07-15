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
        const updateQuery = `UPDATE Products SET title=?, description=?, price=?, category=?, image=?, created_at=NOW() WHERE id= ? AND sellerName=?`;
        const [updatedDataResult] = await connection
          .promise()
          .query(updateQuery, [title, description, price, category, image, id,  sellerName]);

          const [data] = await connection.promise().query(`SELECT * FROM products`);
          const [updatedSellerProducts] = await connection.promise().query(`select * from products where user_id = ?`, [user_id])
          
        
        res.status(200).json({
          success: true,
          message: "Product updated succesfully",
          data,
          updatedSellerProducts
        });
      } else {
        const query = `INSERT INTO Products ( user_id,  title, description, price, category, image, sellerName) VALUES (?, ?, ?, ?, ?, ?, ?)`;
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
          const [sellerProducts] = await connection.promise().query(`SELECT * FROM products where  user_id = ?`, [user_id]);
        res.status(200).json({ sucess: true, message: "New Product Added.", data, sellerProducts });
      }
    } else {
      res.status(500).json({ message: "Invalid User." });
    }
  } catch (err) {
    // console.log('Error in Adding Product: ', err);
    if (err.errno === 1406) {
      res
        .status(200)
        .json({ success: false, message: "Upload small size photo" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Error in adding item to cart." });
    }
  }
});
// for seller only
router.post("/deleteproduct", async (req, res) => {
  try {
    const { id, user_id } = req.body;

    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token

    const isValid = validateJSONToken(token);
    if (isValid) {
      await connection.promise().query(`DELETE FROM products WHERE id=?`, [id]);
      const [data] = await connection.promise().query(`SELECT * FROM products`);
      const [sellerProducts] = await connection.promise().query(`SELECT * FROM products where  user_id = ?`, [user_id]);
      
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

// for user only
router.post("/delete-wishlist", async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
    const isValid = validateJSONToken(token);
    if (isValid) {
      const [result] = await connection
        .promise()
        .query(
          `delete from userwishlist where user_id = ? AND product_id = ?`,
          [user_id, product_id]
        );

        const [findProduct_id] = await connection
        .promise()
        .query(`SELECT product_id FROM userwishlist WHERE user_id = ?`, [user_id]);
        const productArray = findProduct_id.map((item) => item.product_id);
        const idsString = productArray.join(", ");
        const query = `SELECT * FROM products WHERE id IN (${idsString})`;
        if(findProduct_id.length === 0) {
          res
            .status(200)
            .json({ success: true, message: "Deleted Succesfully", updatedWishList: [] });
        } else {
          const [products] = await connection.promise().query(query);
          res
            .status(200)
            .json({ success: true, message: "Deleted Succesfully", updatedWishList: products });
        }

        }
    if (!isValid) {
      res.status(500).json({ success: false, message: "Invalid User." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error in Delete Wishlist." });
  }
});

// for user only
router.post("/add-to-cart", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
    const isValid = validateJSONToken(token);
    const { user_id, product_id, update } = req.body;
    if (isValid) {
      const [data] = await connection
        .promise()
        .query(`SELECT * FROM usercart WHERE user_id = ? AND product_id = ?`, [
          user_id,
          product_id,
        ]);

      if (data.length > 0) {
        if (update === "delete") {
          const query = `delete from usercart where user_id = ? and product_id = ?`;
          await connection.promise().query(query, [user_id, product_id]);
          const [updatedCart] = await connection.promise().query(
            `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
            [user_id]
          );
          res
            .status(200)
            .json({
              success: true,
              message: "Product Deleted Succesfully.",
              updatedCart,
            });
          return;
        }
        if (update === "decrease") {
          let quantity = data[0].quantity;
          if (quantity === 1) {
            const query = `delete from usercart where user_id = ? and product_id = ?`;
            await connection.promise().query(query, [user_id, product_id]);
            const [updatedCart] = await connection.promise().query(
              `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
              [user_id]
            );
            res
              .status(200)
              .json({
                success: true,
                message: "Product Deleted From Cart.",
                data,
                updatedCart,
              });
          } else {
            const query = `update usercart set quantity = ? where product_id= ? `;
            await connection.promise().query(query, [--quantity, product_id]);
            const [updatedCart] = await connection.promise().query(
              `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
              [user_id]
            );
            res
              .status(200)
              .json({ success: true,message: "Product Quantity Updated.", data, updatedCart });
          }
        } else {
          // else increase teh cart quantity
          const query = `update usercart set quantity = ? where product_id= ? `;
          let quantity = data[0].quantity;
          await connection.promise().query(query, [++quantity, product_id]);
          const [updatedCart] = await connection.promise().query(
            `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
            [user_id]
          );
          res
            .status(200)
            .json({ success: true,message: "Product Quantity Updated.", data, updatedCart });
        }
      }
      if (data.length === 0) {
        await connection
          .promise()
          .query(
            `INSERT INTO usercart (user_id, product_id, quantity,   created_at) VALUES (?, ?, ?, ?)`,
            [user_id, product_id, 1, new Date()]
          );
        const [updatedCart] = await connection.promise().query(
          `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
          [user_id]
        );
        res
          .status(200)
          .json({ success: true,message: "Product added in cart succesfully.", updatedCart });
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
router.post("/cart", async (req, res) => {
 
  try {
    const { user_id } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Extract user ID from Bearer token
    const isValid = validateJSONToken(token);

    if (isValid) {
      const [cartItems] = await connection.promise().query(
        `SELECT uc.product_id, uc.quantity, p.* 
                                                            FROM usercart uc 
                                                            JOIN products p ON uc.product_id = p.id 
                                                            WHERE uc.user_id = ?`,
        [user_id]
      );

      if (cartItems.length === 0) {
        res.status(200).json({ message: "No Products Found.", products: [] });
      } else {
        res.status(200).json({ products: cartItems });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid User." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Error in Wishilist" });
  }
});

module.exports = router;
