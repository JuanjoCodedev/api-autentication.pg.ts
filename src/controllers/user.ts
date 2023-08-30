import { Request, Response } from "express";
import appDataSource from "../server/database";
import { Usuario } from "../model/user"; // Asegúrate de importar la entidad adecuada

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function obtenerUsuarios(_req: Request, res: Response) {
  try {
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const usuarios = await usuarioRepository.find();

    res.status(200).json({ usuarios });
  } catch (error) {
    console.error("Error al tratar de obtener los registros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function crearUsuario(req: Request, res: Response) {
  try {
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const { correo_usu, contrasena_usu } = req.body;

    const existingUser = await usuarioRepository.findOne({ where: { correo_usu } });

    if (existingUser) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado" });
    }

    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(contrasena_usu, saltRounds);

    const nuevoUsuario = usuarioRepository.create({
      correo_usu,
      contrasena_usu: hashedPassword,
      // Resto de los campos
    });

    const result = await usuarioRepository.save(nuevoUsuario);

    res.status(201).json({ user: result });
  } catch (error) {
    console.error("Error para la creación de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function obtenerPerfil(req: Request, res: Response) {
  try {
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const cod_usu = parseInt(req.params.cod_usu, 10);

    if (isNaN(cod_usu)) {
      return res.status(400).json({ error: "El código de usuario no es válido" });
    }

    const usuario = await usuarioRepository.findOne({ where: { cod_usu } });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado o no existe" });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    console.error("Error al obtener perfil del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function iniciarSesion(req: Request, res: Response) {
  try {
    const usuarioRepository = appDataSource.getRepository(Usuario);
    const { correo_usu, contrasena_usu } = req.body;

    const usuario = await usuarioRepository.findOne({ where: { correo_usu } });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(contrasena_usu, usuario.contrasena_usu);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const tokenPayload = { cod_usu: usuario.cod_usu };
    const secretKey = "tu_clave_secreta"; // Almacenar en variable de entorno
    const tokenOptions = { expiresIn: "1h" };

    const token = jwt.sign(tokenPayload, secretKey, tokenOptions);

    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export { obtenerUsuarios, crearUsuario, obtenerPerfil, iniciarSesion };
