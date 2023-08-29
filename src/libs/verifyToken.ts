import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado" });
  }

  jwt.verify(token, "tu_clave_secreta", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = user;
    next();
  });
};
