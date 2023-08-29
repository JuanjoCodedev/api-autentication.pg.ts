import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Cambia esto al tipo adecuado para el usuario si lo tienes definido
  }
}