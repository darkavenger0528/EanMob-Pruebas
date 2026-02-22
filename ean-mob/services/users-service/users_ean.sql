CREATE DATABASE IF NOT EXISTS users_ean;
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

  -- NUEVOS CAMPOS PARA OTP EMAIL VALIDATION
  otp VARCHAR(6) NULL,
  otp_expires_at TIMESTAMP NULL,
  email_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);