<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b5ae7f91-23f4-4c00-8744-4bee3447ace4

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env](.env) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker

### Opción 1: Con Docker Compose (Recomendado)
```bash
docker compose up -d --build
```
La aplicación estará disponible en: [http://localhost:8080](http://localhost:8080)

Para detener el contenedor:
```bash
docker compose down
```

### Opción 2: Con Docker CLI directo
```bash
# Construir la imagen
docker build -t salon-gift-app .

# Ejecutar el contenedor (en puerto 8080 para evitar conflictos con el puerto 80 en Windows)
docker run -d -p 8080:80 --name salon_gift_app salon-gift-app
```

