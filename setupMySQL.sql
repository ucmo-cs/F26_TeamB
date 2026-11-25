-- Start from a clean database. Nothing valuable is lost: the old config
-- (ddl-auto: create) wiped every table each time the backend started anyway.
-- DROP DATABASE IF EXISTS loandb;
-- CREATE DATABASE loandb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
 
-- App user. Same username/password on every machine so application.yml can be shared.
-- (Local development only; this is not a real secret.)
CREATE DATABASE IF NOT EXISTS loandb;
CREATE USER IF NOT EXISTS 'loanapp'@'localhost' IDENTIFIED BY 'loanapp';
GRANT ALL PRIVILEGES ON loandb.* TO 'loanapp'@'localhost';
FLUSH PRIVILEGES;
 
-- The backend creates the tables (customer, loan, log_in) and the starter rows
-- (admin/admin and customer/customer) the first time it starts.
