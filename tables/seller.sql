-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2024 at 08:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jiomart`
--

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--
/*

// paste this line in your mysql

CREATE TABLE seller (
  id int(11) NOT NULL AUTO_INCREMENT,
  owner_name varchar(255) NOT NULL,
  business_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  business_category varchar(255) DEFAULT NULL,
  description text DEFAULT NULL,
  PRIMARY KEY(id)
)

*/

CREATE TABLE `seller` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `business_category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`id`, `owner_name`, `business_name`, `email`, `username`, `password`, `business_category`, `description`) VALUES
(1, 'John Doe', 'Doe\'s Bookstore', 'john@example.com', 'johndoe', 'password123', 'Books', 'A bookstore specializing in fiction and non-fiction books.'),
(2, 'Alice Smith', 'Smith\'s Electronics', 'alice@example.com', 'alicesmith', 'securepassword', 'Electronics', 'An electronics store offering a wide range of gadgets and accessories.'),
(3, 'Bob Johnson', 'Johnson\'s Bakery', 'bob@example.com', 'bobjohnson', 'baking123', 'Food & Beverage', 'A bakery known for its delicious cakes, pastries, and breads.'),
(4, 'Emily Davis', 'Davis Fashion Boutique', 'emily@example.com', 'emilydavis', 'fashionista', 'Fashion', 'A boutique offering trendy clothing and accessories for men and women.'),
(5, 'Michael Wilson', 'Wilson\'s Hardware Store', 'michael@example.com', 'michaelwilson', 'hardware123', 'Home & Garden', 'A hardware store providing tools, equipment, and supplies for home improvement projects.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `seller`
--
ALTER TABLE `seller`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `seller`
--
ALTER TABLE `seller`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
