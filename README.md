# Pets Radar API

API desarrollada con NestJS para registrar y consultar reportes de mascotas perdidas y encontradas.

## Deploy

La API y sus servicios ya estan desplegados en linea:

- **API publica:** https://pets-radar-api.onrender.com
- **Base de datos:** Neon PostgreSQL con extension PostGIS
- **Cache:** Upstash Redis
- **Repositorio:** https://github.com/JahirYepez/pets-radar-api

## Endpoints principales

La API usa el prefijo `/api`.

```text
GET  https://pets-radar-api.onrender.com/api
GET  https://pets-radar-api.onrender.com/api/lost-pets
POST https://pets-radar-api.onrender.com/api/lost-pets
GET  https://pets-radar-api.onrender.com/api/lost-pets/radius?lat=19.4326&lon=-99.1332&radiusInMeters=5000

GET  https://pets-radar-api.onrender.com/api/found-pets
POST https://pets-radar-api.onrender.com/api/found-pets
GET  https://pets-radar-api.onrender.com/api/found-pets/radius?lat=19.4326&lon=-99.1332&radiusInMeters=5000
```

## Resumen

El proyecto permite guardar reportes de mascotas perdidas o encontradas con datos de ubicacion. La base de datos usa PostGIS para realizar busquedas por radio usando coordenadas geograficas.

Para probar el funcionamiento, se puede abrir en navegador o Postman

Muchas gracias profesor!
