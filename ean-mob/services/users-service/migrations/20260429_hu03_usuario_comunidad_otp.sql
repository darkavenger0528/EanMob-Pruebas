USE users_ean;

SET @schema_name = DATABASE();

SET @add_otp_sql = IF(
  (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'usuario_comunidad'
      AND COLUMN_NAME = 'otp'
  ) = 0,
  'ALTER TABLE usuario_comunidad ADD COLUMN otp VARCHAR(6) NULL AFTER verified_at',
  'SELECT 1'
);

PREPARE add_otp_stmt FROM @add_otp_sql;
EXECUTE add_otp_stmt;
DEALLOCATE PREPARE add_otp_stmt;

SET @add_otp_expires_sql = IF(
  (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'usuario_comunidad'
      AND COLUMN_NAME = 'otp_expires_at'
  ) = 0,
  'ALTER TABLE usuario_comunidad ADD COLUMN otp_expires_at TIMESTAMP NULL AFTER otp',
  'SELECT 1'
);

PREPARE add_otp_expires_stmt FROM @add_otp_expires_sql;
EXECUTE add_otp_expires_stmt;
DEALLOCATE PREPARE add_otp_expires_stmt;
