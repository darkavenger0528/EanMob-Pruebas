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

  -- RF-02: datos de contacto
  celular VARCHAR(15) NULL,

  -- RF-06: recuperación de contraseña
  reset_token VARCHAR(255) NULL,
  reset_token_expires TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Comunidades verificadas (universidades, empresas, org.) ─────────────────
CREATE TABLE IF NOT EXISTS comunidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  dominio_email VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Relación N:M usuarios ↔ comunidades ────────────────────────────────────
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

-- ─── Datos semilla: comunidades iniciales ────────────────────────────────────
INSERT IGNORE INTO comunidades (nombre, dominio_email, descripcion) VALUES
  ('Universidad EAN', 'universidadean.edu.co', 'Comunidad académica de la Universidad EAN');