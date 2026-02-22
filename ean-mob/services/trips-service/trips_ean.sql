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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
