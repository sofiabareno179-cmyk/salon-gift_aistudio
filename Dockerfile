# syntax=docker/dockerfile:1

# ==========================================
# Etapa 1: Construcción (Build Stage)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Configuración del repositorio público y opciones de compilación
ARG REPO_URL="github.com/sofiabareno179-cmyk/salon-gift_aistudio.git"
ARG BRANCH="main"
ARG GITHUB_TOKEN=""
ARG FORCE_CLONE="false"

# Copiamos el contexto disponible
COPY . /tmp/build-context/

# Si existen archivos locales (desarrollo local o contexto completo), se usan directamente.
# Si el contexto está vacío o solo contiene el Dockerfile (p. ej. Portainer, despliegues web o FORCE_CLONE=true),
# se descarga directamente el repositorio público desde GitHub sin requerir tokens.
RUN if [ "$FORCE_CLONE" != "true" ] && [ -f /tmp/build-context/package.json ]; then \
        echo "=== Usando archivos locales del contexto ===" && \
        cp -a /tmp/build-context/. . ; \
    else \
        echo "=== Clonando repositorio público desde GitHub ===" && \
        apk add --no-cache git && \
        if [ -n "$GITHUB_TOKEN" ]; then \
            git clone --depth 1 -b ${BRANCH} "https://${GITHUB_TOKEN}@${REPO_URL}" . ; \
        else \
            git clone --depth 1 -b ${BRANCH} "https://${REPO_URL}" . ; \
        fi ; \
    fi && \
    rm -rf /tmp/build-context

# Instalar dependencias
RUN npm install

# Argumentos para inyectar variables de entorno de Vite en tiempo de build con valores por defecto
ARG VITE_SUPABASE_URL="https://llcxhdvfcpshmfwxymjt.supabase.co"
ARG VITE_SUPABASE_ANON_KEY="sb_publishable_LEVCS5jK7Hn02XAEypDiZg_XX5N5WZ3"

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Compilar la aplicación para producción (genera la carpeta dist/)
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web en Producción (Nginx)
# ==========================================
FROM nginx:alpine

# Configuración personalizada de Nginx para SPAs (embebida directamente para evitar fallos si el archivo no está en el contexto)
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    gzip on;\n\
    gzip_vary on;\n\
    gzip_min_length 1024;\n\
    gzip_proxied expired no-cache no-store private auth;\n\
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;\n\
    gzip_disable "MSIE [1-6].";\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, max-age=31536000, immutable";\n\
    }\n\
    error_page 500 502 503 504 /50x.html;\n\
    location = /50x.html {\n\
        root /usr/share/nginx/html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados en la etapa de compilación
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto HTTP
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
