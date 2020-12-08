-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 27, 2020 at 01:43 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `development`
--

-- --------------------------------------------------------

--
-- Table structure for table `apikey`
--

CREATE TABLE `apikey` (
                          `id` int(11) UNSIGNED NOT NULL,
                          `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
                           `id` int(11) UNSIGNED NOT NULL,
                           `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `last_edited` double DEFAULT NULL,
                           `position` tinyint(1) UNSIGNED DEFAULT NULL,
                           `topic_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ban`
--

CREATE TABLE `ban` (
                       `id` int(11) UNSIGNED NOT NULL,
                       `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
                           `id` int(11) UNSIGNED NOT NULL,
                           `nit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `business_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `contact_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `admin_id` int(11) UNSIGNED DEFAULT NULL,
                           `users_limit` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customfield`
--

CREATE TABLE `customfield` (
                               `id` int(11) UNSIGNED NOT NULL,
                               `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customfieldoption`
--

CREATE TABLE `customfieldoption` (
                                     `id` int(11) UNSIGNED NOT NULL,
                                     `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `customfield_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customfieldvalue`
--

CREATE TABLE `customfieldvalue` (
                                    `id` int(11) UNSIGNED NOT NULL,
                                    `value` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                    `user_id` int(11) UNSIGNED DEFAULT NULL,
                                    `customfield_id` int(11) UNSIGNED DEFAULT NULL,
                                    `customfieldoption_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customresponse`
--

CREATE TABLE `customresponse` (
                                  `id` int(11) UNSIGNED NOT NULL,
                                  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                  `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
                              `id` int(11) UNSIGNED NOT NULL,
                              `owners` int(11) UNSIGNED DEFAULT NULL,
                              `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                              `private` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department_staff`
--

CREATE TABLE `department_staff` (
                                    `id` int(11) UNSIGNED NOT NULL,
                                    `department_id` int(11) UNSIGNED DEFAULT NULL,
                                    `staff_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
                            `id` int(11) UNSIGNED NOT NULL,
                            `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `allowed` int(11) UNSIGNED DEFAULT NULL,
                            `supported` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
                       `id` int(11) UNSIGNED NOT NULL,
                       `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                       `to` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                       `date` double DEFAULT NULL,
                       `author_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                       `author_staff_id` int(11) UNSIGNED DEFAULT NULL,
                       `author_user_id` int(11) UNSIGNED DEFAULT NULL,
                       `author_staff` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mailtemplate`
--

CREATE TABLE `mailtemplate` (
                                `id` int(11) UNSIGNED NOT NULL,
                                `template` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                `subject` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                `text1` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                `text2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                `text3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `planlimit`
--

CREATE TABLE `planlimit` (
                              `id` int(11) UNSIGNED NOT NULL,
                              `users` int(11) UNSIGNED NOT NULL,
                              `companies` int(11) UNSIGNED NOT NULL,
                              `staff` int(11) UNSIGNED NOT NULL,
                              `departments` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recoverpassword`
--

CREATE TABLE `recoverpassword` (
                                   `id` int(11) UNSIGNED NOT NULL,
                                   `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                   `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                   `staff` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessioncookie`
--

CREATE TABLE `sessioncookie` (
                                 `id` int(11) UNSIGNED NOT NULL,
                                 `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                 `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                 `creation_date` double DEFAULT NULL,
                                 `expiration_date` double DEFAULT NULL,
                                 `user_id` int(11) UNSIGNED DEFAULT NULL,
                                 `is_staff` tinyint(1) UNSIGNED DEFAULT NULL,
                                 `user` tinyint(1) UNSIGNED DEFAULT NULL,
                                 `staff_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
                           `id` int(11) UNSIGNED NOT NULL,
                           `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `value` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
                         `id` int(11) UNSIGNED NOT NULL,
                         `level` int(11) UNSIGNED DEFAULT NULL,
                         `super_user` tinyint(1) UNSIGNED DEFAULT 0,
                         `send_email_on_new_ticket` int(11) UNSIGNED DEFAULT NULL,
                         `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `profile_pic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `verification_token` tinyint(1) UNSIGNED DEFAULT NULL,
                         `disabled` tinyint(1) UNSIGNED DEFAULT NULL,
                         `last_login` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_ticket`
--

CREATE TABLE `staff_ticket` (
                                `id` int(11) UNSIGNED NOT NULL,
                                `ticket_id` int(11) UNSIGNED DEFAULT NULL,
                                `staff_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
                       `id` int(11) UNSIGNED NOT NULL,
                       `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                       `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag_ticket`
--

CREATE TABLE `tag_ticket` (
                              `id` int(11) UNSIGNED NOT NULL,
                              `tag_id` int(11) UNSIGNED DEFAULT NULL,
                              `ticket_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
                          `id` int(11) UNSIGNED NOT NULL,
                          `ticket_number` int(11) UNSIGNED DEFAULT NULL,
                          `unread` tinyint(1) UNSIGNED DEFAULT NULL,
                          `unread_staff` tinyint(1) UNSIGNED DEFAULT NULL,
                          `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `file` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `date` double DEFAULT NULL,
                          `closed` tinyint(1) UNSIGNED DEFAULT NULL,
                          `author_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `author_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `department_id` int(11) UNSIGNED DEFAULT NULL,
                          `author` tinyint(1) UNSIGNED DEFAULT NULL,
                          `author_id` int(11) UNSIGNED DEFAULT NULL,
                          `author_staff` tinyint(1) UNSIGNED DEFAULT NULL,
                          `author_staff_id` int(11) UNSIGNED DEFAULT NULL,
                          `owner_id` int(11) UNSIGNED DEFAULT NULL,
                          `owner` tinyint(1) UNSIGNED DEFAULT NULL,
                          `edited_content` tinyint(1) UNSIGNED DEFAULT NULL,
                          `edited_title` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticketevent`
--

CREATE TABLE `ticketevent` (
                               `id` int(11) UNSIGNED NOT NULL,
                               `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `date` double DEFAULT NULL,
                               `ticket_id` int(11) UNSIGNED DEFAULT NULL,
                               `author_staff_id` int(11) UNSIGNED DEFAULT NULL,
                               `file` tinyint(1) UNSIGNED DEFAULT NULL,
                               `private` int(11) UNSIGNED DEFAULT NULL,
                               `author_user_id` int(11) UNSIGNED DEFAULT NULL,
                               `edited_content` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_user`
--

CREATE TABLE `ticket_user` (
                               `id` int(11) UNSIGNED NOT NULL,
                               `ticket_id` int(11) UNSIGNED DEFAULT NULL,
                               `user_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE `topic` (
                         `id` int(11) UNSIGNED NOT NULL,
                         `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `icon_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `private` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
                        `id` int(11) UNSIGNED NOT NULL,
                        `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `signup_date` datetime DEFAULT current_timestamp(),
                        `tickets` int(11) UNSIGNED DEFAULT NULL,
                        `verification_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `disabled` int(11) UNSIGNED DEFAULT NULL,
                        `company_id` int(11) UNSIGNED NOT NULL DEFAULT 1,
                        `not_registered` tinyint(1) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apikey`
--
ALTER TABLE `apikey`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `article`
--
ALTER TABLE `article`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_article_topic` (`topic_id`);

--
-- Indexes for table `ban`
--
ALTER TABLE `ban`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
    ADD PRIMARY KEY (`id`),
    ADD KEY `company_FK` (`admin_id`);

--
-- Indexes for table `customfield`
--
ALTER TABLE `customfield`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customfieldoption`
--
ALTER TABLE `customfieldoption`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_customfieldoption_customfield` (`customfield_id`);

--
-- Indexes for table `customfieldvalue`
--
ALTER TABLE `customfieldvalue`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_customfieldvalue_user` (`user_id`),
    ADD KEY `index_foreignkey_customfieldvalue_customfield` (`customfield_id`),
    ADD KEY `index_foreignkey_customfieldvalue_customfieldoption` (`customfieldoption_id`);

--
-- Indexes for table `customresponse`
--
ALTER TABLE `customresponse`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_staff`
--
ALTER TABLE `department_staff`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `UQ_f2a19cacc73eb380315c104650ebc8c42d1b75a0` (`department_id`,`staff_id`),
    ADD KEY `index_foreignkey_department_staff_department` (`department_id`),
    ADD KEY `index_foreignkey_department_staff_staff` (`staff_id`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_log_author_staff` (`author_staff_id`),
    ADD KEY `index_foreignkey_log_author_user` (`author_user_id`);

--
-- Indexes for table `mailtemplate`
--
ALTER TABLE `mailtemplate`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `planlimit`
--
ALTER TABLE `planlimit`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recoverpassword`
--
ALTER TABLE `recoverpassword`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessioncookie`
--
ALTER TABLE `sessioncookie`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_sessioncookie_user` (`user_id`),
    ADD KEY `index_foreignkey_sessioncookie_staff` (`staff_id`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_ticket`
--
ALTER TABLE `staff_ticket`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `UQ_8a53d6ad25611e7060ab030785c3c0cef48bc533` (`staff_id`,`ticket_id`),
    ADD KEY `index_foreignkey_staff_ticket_ticket` (`ticket_id`),
    ADD KEY `index_foreignkey_staff_ticket_staff` (`staff_id`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tag_ticket`
--
ALTER TABLE `tag_ticket`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `UQ_79dc4901a5620abff6d65219e6aef86fe9ab63bc` (`tag_id`,`ticket_id`),
    ADD KEY `index_foreignkey_tag_ticket_tag` (`tag_id`),
    ADD KEY `index_foreignkey_tag_ticket_ticket` (`ticket_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_ticket_department` (`department_id`),
    ADD KEY `index_foreignkey_ticket_author` (`author_id`),
    ADD KEY `index_foreignkey_ticket_author_staff` (`author_staff_id`),
    ADD KEY `index_foreignkey_ticket_owner` (`owner_id`);

--
-- Indexes for table `ticketevent`
--
ALTER TABLE `ticketevent`
    ADD PRIMARY KEY (`id`),
    ADD KEY `index_foreignkey_ticketevent_ticket` (`ticket_id`),
    ADD KEY `index_foreignkey_ticketevent_author_staff` (`author_staff_id`),
    ADD KEY `index_foreignkey_ticketevent_author_user` (`author_user_id`);

--
-- Indexes for table `ticket_user`
--
ALTER TABLE `ticket_user`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `UQ_f73b0a7296c1f9101e14c7c4bd6476b9f9a6a2b7` (`ticket_id`,`user_id`),
    ADD KEY `index_foreignkey_ticket_user_ticket` (`ticket_id`),
    ADD KEY `index_foreignkey_ticket_user_user` (`user_id`);

--
-- Indexes for table `topic`
--
ALTER TABLE `topic`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `id` (`id`),
    ADD KEY `user_FK` (`company_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apikey`
--
ALTER TABLE `apikey`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ban`
--
ALTER TABLE `ban`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `customfield`
--
ALTER TABLE `customfield`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customfieldoption`
--
ALTER TABLE `customfieldoption`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customfieldvalue`
--
ALTER TABLE `customfieldvalue`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `customresponse`
--
ALTER TABLE `customresponse`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `department_staff`
--
ALTER TABLE `department_staff`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=454;

--
-- AUTO_INCREMENT for table `mailtemplate`
--
ALTER TABLE `mailtemplate`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `planlimit`
--
ALTER TABLE `planlimit`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recoverpassword`
--
ALTER TABLE `recoverpassword`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT for table `sessioncookie`
--
ALTER TABLE `sessioncookie`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `staff_ticket`
--
ALTER TABLE `staff_ticket`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tag_ticket`
--
ALTER TABLE `tag_ticket`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ticketevent`
--
ALTER TABLE `ticketevent`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ticket_user`
--
ALTER TABLE `ticket_user`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `topic`
--
ALTER TABLE `topic`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
    MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
    ADD CONSTRAINT `c_fk_article_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `company`
--
ALTER TABLE `company`
    ADD CONSTRAINT `company_FK` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customfieldoption`
--
ALTER TABLE `customfieldoption`
    ADD CONSTRAINT `c_fk_customfieldoption_customfield_id` FOREIGN KEY (`customfield_id`) REFERENCES `customfield` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `customfieldvalue`
--
ALTER TABLE `customfieldvalue`
    ADD CONSTRAINT `c_fk_customfieldvalue_customfield_id` FOREIGN KEY (`customfield_id`) REFERENCES `customfield` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_customfieldvalue_customfieldoption_id` FOREIGN KEY (`customfieldoption_id`) REFERENCES `customfieldoption` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_customfieldvalue_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `department_staff`
--
ALTER TABLE `department_staff`
    ADD CONSTRAINT `c_fk_department_staff_department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `c_fk_department_staff_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `log`
--
ALTER TABLE `log`
    ADD CONSTRAINT `c_fk_log_author_staff_id` FOREIGN KEY (`author_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_log_author_user_id` FOREIGN KEY (`author_user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `sessioncookie`
--
ALTER TABLE `sessioncookie`
    ADD CONSTRAINT `c_fk_sessioncookie_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_sessioncookie_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `staff_ticket`
--
ALTER TABLE `staff_ticket`
    ADD CONSTRAINT `c_fk_staff_ticket_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `c_fk_staff_ticket_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tag_ticket`
--
ALTER TABLE `tag_ticket`
    ADD CONSTRAINT `c_fk_tag_ticket_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `c_fk_tag_ticket_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
    ADD CONSTRAINT `c_fk_ticket_author_id` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_ticket_author_staff_id` FOREIGN KEY (`author_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_ticket_department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_ticket_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `ticketevent`
--
ALTER TABLE `ticketevent`
    ADD CONSTRAINT `c_fk_ticketevent_author_staff_id` FOREIGN KEY (`author_staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_ticketevent_author_user_id` FOREIGN KEY (`author_user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
    ADD CONSTRAINT `c_fk_ticketevent_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `ticket_user`
--
ALTER TABLE `ticket_user`
    ADD CONSTRAINT `c_fk_ticket_user_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `c_fk_ticket_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
    ADD CONSTRAINT `user_FK` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
