CREATE DATABASE vehicles_ean;
USE vehicles_ean;
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- FK manual via API
    tipo_vehiculo ENUM('Carro','Moto') NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio YEAR NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    color VARCHAR(30) NOT NULL,
    numero_puestos INT NOT NULL DEFAULT 4,
    soat_vigente BOOLEAN DEFAULT FALSE,
    rtm_vigente BOOLEAN DEFAULT FALSE,
    rtm_verificado BOOLEAN DEFAULT FALSE,
    rtm_mensaje VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

