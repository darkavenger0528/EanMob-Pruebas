CREATE DATABASE trips_ean;
USE trips_ean;
CREATE TABLE trayectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conductor_id INT NOT NULL,  -- FK manual
    nombre_prestador VARCHAR(100) NOT NULL,
    origen VARCHAR(200) NOT NULL,
    destino VARCHAR(200) NOT NULL,
    hora_inicio TIMESTAMP NOT NULL,
    hora_fin TIMESTAMP NULL,
    vehicle_id INT NOT NULL,
    available_seats INT NOT NULL DEFAULT 1,
    cost_per_passenger DECIMAL(10,2) NULL,
    status ENUM('open','in_progress','completed','cancelled') DEFAULT 'open',
    origin_h3 VARCHAR(20) NULL,
    destination_h3 VARCHAR(20) NULL,
    origin_lat DECIMAL(10,7) NULL,
    origin_lng DECIMAL(10,7) NULL,
    destination_lat DECIMAL(10,7) NULL,
    destination_lng DECIMAL(10,7) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
