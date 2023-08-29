// Lista blanca de URLs permitidas
const whiteList = ["http://localhost:3000/api/almacen/iniciar-sesion"];

// Opciones de configuración para CORS
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whiteList.includes(origin)) {
      return callback(null, origin);
    }
    return callback("¡Acceso denegado!");
  },
  credentials: true,
};

export { whiteList, corsOptions };
