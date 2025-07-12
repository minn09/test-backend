# 🌊 API de Surf para Desarrolladores - Guía de Despliegue

Este proyecto es una API REST para desarrolladores freelancers que aman el surf. Se despliega automáticamente usando GitHub Actions y Docker cada vez que haces push a la rama `main`.

## 🏄‍♂️ Características de la API

- **Spots de surf famosos** con información detallada
- **Condiciones actuales** simuladas en tiempo real
- **Pronósticos de 7 días** para cada spot
- **Estadísticas del desarrollador surfista**
- **Consejos** que relacionan surf con programación
- **CORS habilitado** para frontend

## 📋 Requisitos Previos

- Cuenta en [DockerHub](https://hub.docker.com/)
- Repositorio en GitHub
- Docker instalado localmente
- Node.js 18+ (para desarrollo local)

## 🔧 Configuración Inicial

### 1. Crear Token de DockerHub

1. Ve a [hub.docker.com](https://hub.docker.com/)
2. Settings → Security → New Access Token
3. Nombre: "GitHub Actions"
4. Permisos: **Read & Write**
5. Copia el token generado

### 2. Configurar Secrets en GitHub

En tu repositorio de GitHub:
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Agregar estos secrets:

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `DOCKER_USERNAME` | `jonathanhuertascontreras` | Tu usuario de DockerHub |
| `DOCKER_PASSWORD` | `dckr_pat_...` | Tu access token de DockerHub |
| `SERVER_HOST` | `192.168.1.50` | IP de tu servidor local |
| `SERVER_USERNAME` | `tu_usuario` | Usuario SSH del servidor |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH...` | Clave privada SSH completa |
| `SERVER_PORT` | `22` | Puerto SSH (opcional) |

## 📁 Archivos de Configuración

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

env:
  DOCKER_IMAGE: jonathanhuertascontreras/test-backend
  DOCKER_TAG: latest

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile.prod
        push: true
        tags: ${{ env.DOCKER_IMAGE }}:${{ env.DOCKER_TAG }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Deploy to server
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        port: ${{ secrets.SERVER_PORT }}
        script: |
          docker stop svc-test-backend || true
          docker rm svc-test-backend || true
          docker rmi ${{ env.DOCKER_IMAGE }}:${{ env.DOCKER_TAG }} || true
          docker pull ${{ env.DOCKER_IMAGE }}:${{ env.DOCKER_TAG }}
          cd /path/to/your/docker-compose/directory
          docker compose up -d svc-test-backend
          docker ps | grep svc-test-backend
          echo "🚀 Deployment completado exitosamente!"
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  svc-test-backend:
    image: jonathanhuertascontreras/test-backend:latest
    container_name: svc-test-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - surf-network

networks:
  surf-network:
    driver: bridge
```

## 🔄 Flujo de Trabajo

### 1. Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# La API estará disponible en http://localhost:3000
```

### 2. Despliegue Automático
```bash
# Hacer cambios en el código
git add .
git commit -m "Nuevas funcionalidades de surf"
git push origin main
```

- GitHub Actions detecta el push a `main`
- Construye la imagen Docker optimizada
- Sube la imagen a DockerHub
- Se conecta al servidor y despliega automáticamente

### 3. Ejecución Local con Docker
```bash
# Después de que GitHub Actions termine
docker pull jonathanhuertascontreras/test-backend
docker compose up -d
```

## 🌐 Endpoints de la API

### Información de Spots
- `GET /api/surf-spots` - Lista todos los spots
- `GET /api/surf-spots/:id` - Detalles de un spot específico

### Condiciones y Pronósticos
- `GET /api/condiciones-actuales/:spotId` - Condiciones actuales
- `GET /api/pronostico/:spotId` - Pronóstico de 7 días

### Datos del Desarrollador
- `GET /api/estadisticas-desarrollador` - Estadísticas del dev surfista
- `GET /api/consejos-surf-codigo` - Consejos surf + programación

### Ejemplo de Respuesta
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Pipeline",
      "ubicacion": "North Shore, Hawaii",
      "tipo": "Reef Break",
      "dificultad": "Experto",
      "alturaPromedio": "3-6 metros"
    }
  ]
}
```

## 🛠️ Comandos Útiles

### Docker Compose
```bash
# Iniciar la API
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f svc-test-backend

# Detener la API
docker compose down

# Reiniciar
docker compose restart svc-test-backend

# Ver estado
docker compose ps
```

### Docker (comandos alternativos)
```bash
# Ejecutar sin docker-compose
docker run -p 3000:3000 jonathanhuertascontreras/test-backend

# Ver imágenes locales
docker images | grep test-backend

# Ver contenedores corriendo
docker ps | grep svc-test-backend

# Ver logs del contenedor
docker logs svc-test-backend
```

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Ejecutar con nodemon (si lo tienes instalado)
npx nodemon src/index.js
```

## 🌐 Acceso a la API

- **URL local**: `http://localhost:3000`
- **Puerto**: 3000
- **Contenedor**: `svc-test-backend`
- **Health check**: `http://localhost:3000/`

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de autenticación DockerHub**
   ```bash
   # Verificar secrets en GitHub
   # Settings → Secrets and variables → Actions
   ```

2. **Puerto 3000 ocupado**
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3001:3000"  # Usar puerto 3001 externamente
   ```

3. **Error de conexión SSH**
   ```bash
   # Verificar que SSH esté corriendo
   sudo systemctl status ssh
   
   # Verificar clave SSH
   ssh -i ~/.ssh/id_rsa usuario@ip_servidor
   ```

4. **Contenedor no inicia**
   ```bash
   # Ver logs detallados
   docker logs svc-test-backend
   
   # Verificar health check
   curl http://localhost:3000/
   ```

### Verificar Estado
```bash
# Ver logs del workflow en GitHub
# Ir a: Repositorio → Actions → Deploy to Production

# Ver logs del contenedor
docker compose logs -f svc-test-backend

# Ver estado del contenedor
docker compose ps

# Probar endpoints
curl http://localhost:3000/api/surf-spots
```

## 📝 Notas Importantes

- **Secrets**: Nunca subas tokens o credenciales al repositorio
- **CORS**: La API está configurada para aceptar peticiones desde cualquier origen
- **Health Check**: El contenedor incluye health check automático
- **Multi-stage Build**: El Dockerfile usa multi-stage para optimizar el tamaño
- **Usuario no-root**: El contenedor se ejecuta con usuario no-root por seguridad

## 🔗 Enlaces Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Express.js Documentation](https://expressjs.com/)
- [DockerHub](https://hub.docker.com/)

## 🏄‍♂️ Spots Incluidos

1. **Pipeline** - North Shore, Hawaii
2. **Teahupoo** - Tahití
3. **Mundaka** - País Vasco, España
4. **Jeffreys Bay** - Sudáfrica
5. **Uluwatu** - Bali, Indonesia

---

**¡Listo!** Tu API de surf se desplegará automáticamente cada vez que hagas push a `main`. 🌊💻