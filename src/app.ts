import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

import { whiteList, corsOptions } from "./libs/configCors";
import router from "./Routes/user";

import { tokenValidation } from "./libs/verifyToken";

const app: Application = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: whiteList }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/almacen", cors(corsOptions), router, tokenValidation);

// Ruta de prueba para acceso permitido
app.get("/api/almacen/acceso-permitido", (_req: Request, res: Response) => {
  res.status(200).json({ msg: "¡Acceso permitido!" });
});

export default app;
