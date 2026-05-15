-- HU-07: publicar viaje con vehículo, plazas, costo y datos de matching.
-- Ejecutar sobre la base existente `trips_ean`.

ALTER TABLE trayectos ADD COLUMN vehicle_id INT NULL;
ALTER TABLE trayectos ADD COLUMN available_seats INT NOT NULL DEFAULT 1;
ALTER TABLE trayectos ADD COLUMN cost_per_passenger DECIMAL(10,2) NULL;
ALTER TABLE trayectos ADD COLUMN status ENUM('open','in_progress','completed','cancelled') DEFAULT 'open';
ALTER TABLE trayectos ADD COLUMN origin_h3 VARCHAR(20) NULL;
ALTER TABLE trayectos ADD COLUMN destination_h3 VARCHAR(20) NULL;
ALTER TABLE trayectos ADD COLUMN origin_lat DECIMAL(10,7) NULL;
ALTER TABLE trayectos ADD COLUMN origin_lng DECIMAL(10,7) NULL;
ALTER TABLE trayectos ADD COLUMN destination_lat DECIMAL(10,7) NULL;
ALTER TABLE trayectos ADD COLUMN destination_lng DECIMAL(10,7) NULL;
ALTER TABLE trayectos ADD COLUMN notes TEXT NULL;
