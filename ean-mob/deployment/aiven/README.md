# Aiven MySQL free tier para EANMob

Usamos Aiven for MySQL Free Tier como ambiente remoto de pruebas porque es MySQL gestionado, permite acceso por internet, cuesta 0 USD y no pide tarjeta para crear la cuenta. El limite actual del plan gratuito es suficiente para pruebas de implementacion: 1 nodo, 1 CPU, 1 GB RAM y 1 GB de disco.

## Crear el servicio

1. Crear una cuenta en Aiven.
2. Crear un servicio `MySQL` con plan `Free`.
3. Esperar a que el servicio quede `Running`.
4. En `Overview > Connection information`, copiar `host`, `port`, `user` y `password`.
5. Descargar el certificado CA desde la misma pantalla y guardarlo fuera del repo, por ejemplo:

```bash
mkdir -p ~/.eanmob/certs
# Guardar el certificado como:
# ~/.eanmob/certs/aiven-ca.pem
```

## Inicializar esquemas

Ejecutar el SQL de bootstrap contra la conexion de Aiven. Este archivo crea o actualiza las bases `users_ean`, `vehicles_ean` y `trips_ean`.

```bash
cd /Users/miguelacho/EanMob-Pruebas/ean-mob

mysql \
  --host <aiven-mysql-host> \
  --port <aiven-mysql-port> \
  --user avnadmin \
  --password \
  --ssl-ca ~/.eanmob/certs/aiven-ca.pem \
  defaultdb < deployment/aiven/cloud-mysql-init.sql
```

## Configurar servicios

Crear los `.env` reales desde los ejemplos, sin commitear secretos:

```bash
cp deployment/aiven/users-service.env.example services/users-service/.env
cp deployment/aiven/vehicles-service.env.example services/vehicles-service/.env
cp deployment/aiven/trips-service.env.example services/trips-service/.env
```

Editar cada `.env` con los datos reales de Aiven. Mantener:

```env
DB_SSL=true
DB_SSL_CA_PATH=/absolute/path/to/aiven-ca.pem
DB_SSL_REJECT_UNAUTHORIZED=true
```

## Probar conexion

```bash
cd /Users/miguelacho/EanMob-Pruebas/ean-mob/services/users-service
npm start
```

Repetir con `vehicles-service` y `trips-service` cambiando a su carpeta correspondiente.

## Migracion futura

Cuando pasemos a una nube o servidor propio, el cambio deberia limitarse a variables de entorno:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`
- `DB_SSL_CA_PATH`

El esquema queda portable porque sigue siendo SQL MySQL y no usa APIs especificas de Aiven.
