CREATE DATABASE vehicles_ean;
USE vehicles_ean;
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- FK manual via API
    tipo_vehiculo ENUM('Carro','Moto') NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    color VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



