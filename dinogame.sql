-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 24, 2021 at 07:30 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dinogame`
--

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `score` int(11) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`score`, `nickname`, `avatar`, `date`, `id`) VALUES
(358, 'Starsky', 'green', '2021-12-20 23:00:00', 1),
(1297, 'Hutch', 'red', '2021-12-20 23:00:00', 2),
(313, 'Yello', 'yellow', '2021-12-22 18:42:22', 6),
(151, 'BBLU', 'reinier', '2021-12-22 19:08:42', 31),
(67, 'newone', 'reinier', '2021-12-22 20:50:27', 33),
(177, 'bleh', 'green', '2021-12-22 21:02:25', 34),
(25, 'bafgif', 'yellow', '2021-12-23 09:53:18', 39),
(25, 'testooo', 'red', '2021-12-23 09:55:15', 40),
(47, 'delete stuff', 'reinier', '2021-12-23 10:51:40', 44),
(683, 'AAA', 'red', '2021-12-23 11:03:07', 45),
(170, 'BBB', 'yellow', '2021-12-23 12:08:11', 46),
(129, 'R', 'reinier', '2021-12-23 14:29:55', 47),
(25, 'test', 'roberta', '2021-12-24 12:39:16', 48);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
