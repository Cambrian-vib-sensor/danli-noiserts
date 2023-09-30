-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2022 at 11:18 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `routers`
--

CREATE TABLE `routers` (
  `id` bigint(20) NOT NULL,
  `simcardno` varchar(25) NOT NULL,
  `admin` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `remark` varchar(50) DEFAULT NULL,
  `created_by` varchar(25) NOT NULL DEFAULT 'admin',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `location_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `routers`
--

INSERT INTO `routers` (`id`, `simcardno`, `admin`, `password`, `remark`, `created_by`, `created_at`, `updated_at`, `location_id`) VALUES
(1, '896503051912006783', 'MM190079100415', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 24),
(2, '896503051912006778', 'MM190079100412', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(3, '8965011904070177544', 'MM190079100492', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 5),
(4, '896503051912006754', 'MM190079100411', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 20),
(5, '896051912006783', 'MM190079100413', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 23),
(6, '896503051912006779', 'MM190079100414', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 8),
(7, '8965012006260827059', 'MM190079100500', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(8, '8965012006260827042', 'MM190079100491', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 6),
(9, '8965012006260827034', 'MM190079100499', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 11),
(10, '896503051912006780', 'MM190079100495', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 22),
(11, '51912006781', 'MM190079100114', 'C20ec2012', '-', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(12, '8965012006261606114', 'MM190079100112', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 3),
(13, '896503051912006781', 'MM190079100116', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 2),
(14, '896503051912006720', 'MM190079100115', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 21),
(15, '8965012006260827133', 'MM190079100118', 'C20ec2012', 'Raw data collecting router (Office)', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 24),
(16, '8965012006260827125', 'MM190079100117', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(17, '8965012006261606122', 'MM190079100111', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 10),
(18, '896501200626082714', 'MM190079100113', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 13),
(19, '190079100120', 'MM190079100120', 'C20ec2012', 'Office - Faulty (Circuit Issues)', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(20, '896503051912006786', 'MM190079100119', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 19),
(21, '190079100226', 'MM190079100226', 'C20ec2012', 'Office - Faulty', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(22, '190079100222', 'MM190079100222', 'C20ec2012', 'Office - Faulty', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(23, '896503051912006719', 'MM190079100227', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 8),
(24, '896503051912006718', 'MM190079100228', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 5),
(25, '896503051912006777', 'MM190079100224', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 22),
(26, '8965011904070180548', 'MM190079100229', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(27, '8965011904070180530', 'MM190079100223', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 16),
(28, '8965011904070180555', 'MM190079100230', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 2),
(29, '896503051912006784', 'MM190079100225', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 7),
(30, '896503012103005456', 'MM190079100014', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 5),
(31, '190079100018', 'MM190079100018', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 24),
(32, '896503051912006776', 'MM190079100019', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(33, '896503051912006773', 'MM190079100017', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(34, '8965011904070177551', 'MM190079100012', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 22),
(35, '190079100020', 'MM190079100020', 'C20ec2012', 'Office - Faulty (Circuit Issues)', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(36, '8965012006260827018', 'MM190079100013', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 14),
(37, '8965011904070180563', 'MM190079100221', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 17),
(38, '896503051912006787', 'MM190079100011', 'C20ec2012', 'Siew Keng WFH', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(39, '896503051912006785', 'MM190079100015', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 1),
(40, '8965011904070177528', 'MM204500001072', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 18),
(41, '896503012103005458', 'MM204500001076', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 12),
(42, '896503051912006758', 'MM204500001075', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 9),
(43, '204500001078', 'MM204500001078', 'C20ec2012', 'Office - Faulty (Circuit Issues)', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(44, '896503012103005000', 'MM204500001077', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 12),
(45, '896503051912006722', 'MM204500001080', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 11),
(46, '8965011904070177536', 'MM204500001079', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 9),
(47, '896503051912006782', 'MM204500001071', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', NULL),
(48, '8965012006260827026', 'MM204500001073', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 2),
(49, '896503012103005460', 'MM204500001074', 'C20ec2012', 'Vibration Monitoring', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 4),
(50, '190079100016', 'MM190079100016', 'C20ec2012', 'Johan GPS', 'admin', '2022-11-11 09:22:59', '2022-11-11 09:22:59', 24);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `routers`
--
ALTER TABLE `routers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `simcardno` (`simcardno`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `routers`
--
ALTER TABLE `routers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `routers`
--
ALTER TABLE `routers`
  ADD CONSTRAINT `routers_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
