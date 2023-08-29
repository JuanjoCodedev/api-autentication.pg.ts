import { Request, Response } from "express";
import { postgresConexion } from "../server/database";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function obtenerUsuarios(_req: Request, res: Response) {
  try {
    const query = "SELECT * FROM usuarios";
    const result = await postgresConexion.query(query);

    // Enviar la respuesta con los datos de los usuarios
    res.status(200).json({ usuarios: result.rows });
  } catch (error) {
    console.error("Error al tratar de obtener los registros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function crearUsuario(req: Request, res: Response) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { cod_usu, nombre_usu, correo_usu, contrasena_usu, telefono_usu, direccion_usu, cargo_usu } = req.body;

    // Verificar si el correo ya existe en la base de datos antes de la inserción
    const emailExistsQuery = "SELECT * FROM usuarios WHERE correo_usu = $1";
    const emailExistsResult = await postgresConexion.query(emailExistsQuery, [correo_usu]);

    if (emailExistsResult.rows.length > 0) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado" });
    }

    // Hash de la contraseña utilizando bcrypt
    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(contrasena_usu, saltRounds);

    // Consulta SQL para insertar un nuevo usuario con contraseña hasheada
    const query = `INSERT INTO usuarios (cod_usu, nombre_usu, correo_usu, contrasena_usu, telefono_usu, direccion_usu, cargo_usu) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * `;

    // Ejecutar la consulta SQL y obtener el resultado
    const result = await postgresConexion.query(query, [cod_usu, nombre_usu, correo_usu, hashedPassword, telefono_usu, direccion_usu, cargo_usu]);

    // Enviar la respuesta con los datos del nuevo usuario y el token JWT
    res.status(201).json({ user: result.rows[0] }); // Usar el código de estado 201 para "Created"
  } catch (error) {
    console.error("Error para la creación de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function obtenerPerfil(req: Request, res: Response) {
  try {
    // Convertir el valor a número entero
    const cod_usu = parseInt(req.params.cod_usu, 10);

    if (isNaN(cod_usu)) {
      return res.status(400).json({ error: "El código de usuario no es válido" });
    }

    const query = "SELECT * FROM usuarios WHERE cod_usu = $1";

    // Ejecutar la consulta SQL y obtener el resultado
    const result = await postgresConexion.query(query, [cod_usu]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado o no existe" });
    }

    // Enviar la respuesta con el código de usuario
    res.status(200).json({ usuario: result.rows[0] }); // Enviar el código de usuario como respuesta JSON
  } catch (error) {
    console.error("Error al obtener perfil del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function iniciarSesion(req: Request, res: Response) {
  try {
    const { correo_usu, contrasena_usu } = req.body;

    // Consulta SQL para obtener el hash de la contraseña almacenada
    const query = "SELECT cod_usu, contrasena_usu FROM usuarios WHERE correo_usu = $1";
    const result = await postgresConexion.query(query, [correo_usu]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(contrasena_usu, user.contrasena_usu);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar y devuelve un token JWT con información del usuario
    const tokenPayload = { cod_usu: user.cod_usu };
    const secretKey = "tu_clave_secreta"; // Deberías almacenar esta clave en una variable de entorno
    const tokenOptions = { expiresIn: "1h" }; // tiempo token (h = hora, s = segundos, m = minutos)

    const token = jwt.sign(tokenPayload, secretKey, tokenOptions);

    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export { obtenerUsuarios, crearUsuario, obtenerPerfil, iniciarSesion };
