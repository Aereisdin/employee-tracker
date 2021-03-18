CREATE DATABASE `workplace_db`;
USE `workplace_db`;
CREATE TABLE `Department`(
`id` INT AUTO_INCREMENT NOT NULL,
`name` TEXT NOT NULL,
PRIMARY KEY (`id`)
);
CREATE TABLE `Role`(
`id` INT AUTO_INCREMENT NOT NULL,
`title` TEXT NOT NULL,
`salary` DECIMAL,
`department_id` INT,
PRIMARY KEY (`id`)
);
CREATE TABLE `Employee`(
`id` INT AUTO_INCREMENT NOT NULL,
`first_name` TEXT NOT NULL,
`last_name` TEXT NOT NULL,
`role_id` INT,
`manager_id` INT,
PRIMARY KEY (`id`)
);
INSERT INTO `Employee`(first_name, last_name, role_id)
VALUES ("Tom", "Jones", 1);
INSERT INTO `Role`(title, salary, department_id)
VALUES ("CEO", 10000, 1);
INSERT INTO `Department`(`name`)
VALUES ("Executive Officer")

