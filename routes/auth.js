const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const connection = require("../DB/db");

// for user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobileNumber, password, userType } = req.body;
    const query = `INSERT INTO users (name, email,mobileNumber, password, userType)  values(?, ?, ?, ?, ?)`;
    const [result] = await connection
      .promise()
      .query(query, [name, email, mobileNumber, password, userType]);
    const token = jwt.sign(
      { name, email, mobileNumber, password, userType },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      success: true,
      message: "Sign up successful ",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in signup.",
    });
  }
});
// for user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `select * from users where email = ? and  password = ?`;

    const [data] = await connection.promise().query(query, [email, password]);

    if (data.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Credentials Provided." });
    } else {   
      const token = jwt.sign({ email, password, data }, "your-secret-key", {
        expiresIn: "3h",
      });
      res.status(200).json({
        success: true,
        message: "Login up successful ",
        token,
      });
    }
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({
      success: false,
      message: "Error in signup.",
    });
  }
});

router.post("/seller-signup", async (req, res) => {
  try {
    const {
      owner_name,
      business_name,
      email,
      username,
      business_category,
      password,
      description,
    } = req.body;
    const query = `INSERT INTO seller (owner_name, business_name,  email, username, password, business_category, description)  values(?, ?, ?, ?, ?, ?, ?)`;
    await connection
      .promise()
      .query(query, [
        owner_name,
        business_name,
        email,
        username,
        password,
        business_category,
        description,
      ]);
    res.status(200).json({
      success: true,
      message: "User Created Succesfully.",
    });
  } catch (err) {
    console.log("Error in seller-login: ", err);
    res.status(500).json({ success: false, message: "Error in Seller Login." });
  }
});
router.post("/seller-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `select * from seller where email = ? and  password = ?`;

    const [data] = await connection.promise().query(query, [email, password]);

    if (data.length === 0) {
      
      res
      .status(400)
      .json({ success: false, message: "Invalid Credentials Provided." });
    } else {
      console.log('/id:  ', data[0]?.id);
      const [sellerProducts] = await connection.promise().query(`SELECT * FROM products WHERE seller_id = ?`, [data[0]?.id]);
      const token = jwt.sign({data}, "your-secret-key", {
        expiresIn: "1h",
      });
      res.status(200).json({
        success: true,
        message: "Login up successful ",
        token,
        sellerProducts
      });
    }
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({
      success: false,
      message: "Error in signup.",
    });
  }
});

module.exports = router;
