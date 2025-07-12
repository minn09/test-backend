import express, { json } from 'express';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(json());

// Middleware CORS para permitir peticiones desde el frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta GET simple
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! 🌊 API de Surf para Desarrolladores!');
});

// Ruta POST de ejemplo
app.post('/echo', (req, res) => {
  res.json({
    recibido: req.body
  });
});

// Datos de spots de surf populares
const surfSpots = [
  {
    id: 1,
    nombre: "Pipeline",
    ubicacion: "North Shore, Hawaii",
    tipo: "Reef Break",
    dificultad: "Experto",
    mejorEpoca: "Noviembre - Marzo",
    alturaPromedio: "3-6 metros",
    descripcion: "Una de las olas más famosas del mundo, conocida por sus tubos perfectos",
    coordenadas: { lat: 21.6649, lng: -158.0534 }
  },
  {
    id: 2,
    nombre: "Teahupoo",
    ubicacion: "Tahití",
    tipo: "Reef Break",
    dificultad: "Experto",
    mejorEpoca: "Mayo - Octubre",
    alturaPromedio: "2-4 metros",
    descripcion: "Ola pesada y tubular, famosa por su ferocidad",
    coordenadas: { lat: -17.8419, lng: -149.2674 }
  },
  {
    id: 3,
    nombre: "Mundaka",
    ubicacion: "País Vasco, España",
    tipo: "River Mouth",
    dificultad: "Intermedio-Experto",
    mejorEpoca: "Septiembre - Marzo",
    alturaPromedio: "2-4 metros",
    descripcion: "Ola izquierda perfecta en la desembocadura del río",
    coordenadas: { lat: 43.4073, lng: -2.6987 }
  },
  {
    id: 4,
    nombre: "Jeffreys Bay",
    ubicacion: "Sudáfrica",
    tipo: "Point Break",
    dificultad: "Intermedio-Experto",
    mejorEpoca: "Junio - Agosto",
    alturaPromedio: "2-5 metros",
    descripcion: "Ola derecha larga y perfecta, conocida como 'J-Bay'",
    coordenadas: { lat: -34.0333, lng: 24.9167 }
  },
  {
    id: 5,
    nombre: "Uluwatu",
    ubicacion: "Bali, Indonesia",
    tipo: "Reef Break",
    dificultad: "Experto",
    mejorEpoca: "Mayo - Septiembre",
    alturaPromedio: "2-4 metros",
    descripcion: "Ola izquierda poderosa en un templo sagrado",
    coordenadas: { lat: -8.8167, lng: 115.0833 }
  }
];

// Endpoint para obtener todos los spots de surf
app.get('/api/surf-spots', (req, res) => {
  res.json({
    success: true,
    data: surfSpots,
    total: surfSpots.length
  });
});

// Endpoint para obtener un spot específico por ID
app.get('/api/surf-spots/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const spot = surfSpots.find(s => s.id === id);
  
  if (!spot) {
    return res.status(404).json({
      success: false,
      message: 'Spot de surf no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: spot
  });
});

// Endpoint para obtener condiciones actuales simuladas
app.get('/api/condiciones-actuales/:spotId', (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const spot = surfSpots.find(s => s.id === spotId);
  
  if (!spot) {
    return res.status(404).json({
      success: false,
      message: 'Spot de surf no encontrado'
    });
  }
  
  // Simular condiciones actuales
  const condiciones = {
    spotId: spotId,
    spotNombre: spot.nombre,
    timestamp: new Date().toISOString(),
    alturaOlas: (Math.random() * 3 + 1).toFixed(1) + 'm',
    direccionViento: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    velocidadViento: Math.floor(Math.random() * 20 + 5) + ' km/h',
    temperatura: Math.floor(Math.random() * 10 + 18) + '°C',
    calidadOlas: ['Excelente', 'Buena', 'Regular', 'Mala'][Math.floor(Math.random() * 4)],
    marea: ['Bajamar', 'Subiendo', 'Pleamar', 'Bajando'][Math.floor(Math.random() * 4)],
    recomendacion: Math.random() > 0.5 ? '¡Buen día para surfear!' : 'Mejor esperar a mañana'
  };
  
  res.json({
    success: true,
    data: condiciones
  });
});

// Endpoint para obtener pronóstico de olas (simulado)
app.get('/api/pronostico/:spotId', (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const spot = surfSpots.find(s => s.id === spotId);
  
  if (!spot) {
    return res.status(404).json({
      success: false,
      message: 'Spot de surf no encontrado'
    });
  }
  
  // Simular pronóstico para los próximos 7 días
  const pronostico = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    
    pronostico.push({
      fecha: fecha.toISOString().split('T')[0],
      alturaOlas: (Math.random() * 4 + 0.5).toFixed(1) + 'm',
      direccionViento: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      velocidadViento: Math.floor(Math.random() * 25 + 5) + ' km/h',
      temperatura: Math.floor(Math.random() * 12 + 16) + '°C',
      calidadOlas: ['Excelente', 'Buena', 'Regular', 'Mala'][Math.floor(Math.random() * 4)],
      recomendacion: Math.random() > 0.6 ? '¡Día perfecto!' : Math.random() > 0.3 ? 'Día bueno' : 'Mejor otro día'
    });
  }
  
  res.json({
    success: true,
    data: {
      spotId: spotId,
      spotNombre: spot.nombre,
      pronostico: pronostico
    }
  });
});

// Endpoint para obtener estadísticas de surf para desarrolladores
app.get('/api/estadisticas-desarrollador', (req, res) => {
  const estadisticas = {
    tiempoSurfeando: Math.floor(Math.random() * 1000 + 500) + ' horas',
    spotsVisitados: Math.floor(Math.random() * 50 + 20),
    olasAtrapadas: Math.floor(Math.random() * 5000 + 2000),
    mejorSesion: {
      fecha: '2024-01-15',
      spot: 'Pipeline',
      duracion: '4 horas',
      olasAtrapadas: 25,
      alturaMaxima: '3.5m'
    },
    codigoEscritoEnPlaya: Math.floor(Math.random() * 100 + 50) + ' líneas',
    proyectosCompletados: Math.floor(Math.random() * 20 + 10),
    balanceVida: 'Surf + Code = Felicidad 🏄‍♂️💻'
  };
  
  res.json({
    success: true,
    data: estadisticas
  });
});

// Endpoint para obtener consejos de surf para programadores
app.get('/api/consejos-surf-codigo', (req, res) => {
  const consejos = [
    {
      categoria: "Productividad",
      consejo: "Surfea temprano en la mañana antes de empezar a programar. La claridad mental que obtienes es invaluable.",
      relacion: "Como el debugging, necesitas paciencia y observación"
    },
    {
      categoria: "Técnica",
      consejo: "Aprende a leer las olas como lees el código - busca patrones y anticipa el flujo.",
      relacion: "Similar a entender la arquitectura de un sistema"
    },
    {
      categoria: "Mentalidad",
      consejo: "No te frustres si no atrapas todas las olas. Cada sesión es aprendizaje, como cada línea de código.",
      relacion: "El desarrollo es iterativo, igual que mejorar en surf"
    },
    {
      categoria: "Equilibrio",
      consejo: "Programa remoto cerca de la playa. La flexibilidad del freelancing te permite surfear cuando las condiciones son perfectas.",
      relacion: "Optimiza tu entorno de trabajo como optimizas tu código"
    },
    {
      categoria: "Comunidad",
      consejo: "Conecta con otros surfistas programadores. La comunidad es tan importante en el agua como en GitHub.",
      relacion: "Networking y colaboración en ambos mundos"
    }
  ];
  
  res.json({
    success: true,
    data: consejos
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌊 API de Surf para Desarrolladores escuchando en http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   GET /api/surf-spots - Lista de spots de surf`);
  console.log(`   GET /api/surf-spots/:id - Detalles de un spot específico`);
  console.log(`   GET /api/condiciones-actuales/:spotId - Condiciones actuales`);
  console.log(`   GET /api/pronostico/:spotId - Pronóstico de 7 días`);
  console.log(`   GET /api/estadisticas-desarrollador - Estadísticas del dev surfista`);
  console.log(`   GET /api/consejos-surf-codigo - Consejos para surfistas programadores`);
});
