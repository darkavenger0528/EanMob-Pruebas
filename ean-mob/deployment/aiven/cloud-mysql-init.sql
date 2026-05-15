-- EANMob remote MySQL bootstrap for test/staging environments.
-- Safe to run more than once. It creates the Node.js service schemas and
-- upgrades older local schemas with columns added after initial Docker setup.

CREATE DATABASE IF NOT EXISTS users_ean
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE users_ean;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  tipo_documento ENUM('CC','TI') NOT NULL,
  numero_identificacion VARCHAR(10) NOT NULL UNIQUE,
  correo VARCHAR(50) NOT NULL UNIQUE,
  rol ENUM('Director','Estudiante','Profesor') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  grupo_sanguineo ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NULL,
  sexo ENUM('H','M','Otro') NULL,
  altura_cm DECIMAL(5,2) NULL,
  peso_kg DECIMAL(5,2) NULL,
  otp VARCHAR(6) NULL,
  otp_expires_at TIMESTAMP NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  celular VARCHAR(15) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'usuarios'
    AND COLUMN_NAME = 'celular'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE usuarios ADD COLUMN celular VARCHAR(15) NULL AFTER email_verified',
  'SELECT ''usuarios.celular already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'usuarios'
    AND COLUMN_NAME = 'reset_token'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255) NULL AFTER celular',
  'SELECT ''usuarios.reset_token already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'usuarios'
    AND COLUMN_NAME = 'reset_token_expires'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE usuarios ADD COLUMN reset_token_expires TIMESTAMP NULL AFTER reset_token',
  'SELECT ''usuarios.reset_token_expires already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS comunidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  dominio_email VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuario_comunidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community_id INT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_community (user_id, community_id),
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES comunidades(id) ON DELETE CASCADE
);

INSERT IGNORE INTO comunidades (nombre, dominio_email, descripcion) VALUES
  ('Universidad EAN', 'universidadean.edu.co', 'Comunidad academica de la Universidad EAN');

CREATE DATABASE IF NOT EXISTS vehicles_ean
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE vehicles_ean;

CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo_vehiculo ENUM('Carro','Moto') NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  placa VARCHAR(10) NOT NULL UNIQUE,
  color VARCHAR(30) NOT NULL,
  soat_vigente BOOLEAN DEFAULT FALSE,
  rtm_vigente BOOLEAN DEFAULT FALSE,
  rtm_verificado BOOLEAN DEFAULT FALSE,
  rtm_mensaje VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'vehiculos'
    AND COLUMN_NAME = 'soat_vigente'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE vehiculos ADD COLUMN soat_vigente BOOLEAN DEFAULT FALSE AFTER color',
  'SELECT ''vehiculos.soat_vigente already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'vehiculos'
    AND COLUMN_NAME = 'rtm_vigente'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE vehiculos ADD COLUMN rtm_vigente BOOLEAN DEFAULT FALSE AFTER soat_vigente',
  'SELECT ''vehiculos.rtm_vigente already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'vehiculos'
    AND COLUMN_NAME = 'rtm_verificado'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE vehiculos ADD COLUMN rtm_verificado BOOLEAN DEFAULT FALSE AFTER rtm_vigente',
  'SELECT ''vehiculos.rtm_verificado already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'vehiculos'
    AND COLUMN_NAME = 'rtm_mensaje'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE vehiculos ADD COLUMN rtm_mensaje VARCHAR(255) NULL AFTER rtm_verificado',
  'SELECT ''vehiculos.rtm_mensaje already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'vehiculos'
    AND COLUMN_NAME = 'updated_at'
);
SET @sql := IF(
  @column_exists = 0,
  'ALTER TABLE vehiculos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
  'SELECT ''vehiculos.updated_at already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE DATABASE IF NOT EXISTS trips_ean
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE trips_ean;

CREATE TABLE IF NOT EXISTS trayectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conductor_id INT NOT NULL,
  nombre_prestador VARCHAR(100) NOT NULL,
  origen VARCHAR(200) NOT NULL,
  destino VARCHAR(200) NOT NULL,
  hora_inicio TIMESTAMP NOT NULL,
  hora_fin TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
