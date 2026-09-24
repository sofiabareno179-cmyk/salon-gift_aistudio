# ==========================================
# Etapa 1: Construcción (Build Stage)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente del proyecto
COPY . .

# Argumentos opcionales para inyectar variables de entorno de Vite en tiempo de build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Compilar la aplicación para producción (genera la carpeta dist/)
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web en Producción (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar la configuración personalizada de Nginx para SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados en la etapa de compilación
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto HTTP
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
