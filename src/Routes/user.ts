import { Router } from "express";
import { tokenValidation } from "../libs/verifyToken";
import { obtenerUsuarios, crearUsuario, obtenerPerfil, iniciarSesion } from "../controllers/user";

const router: Router = Router();

// Definir rutas con nombres más descriptivos
router.get("/usuarios", obtenerUsuarios);
router.post("/usuarios", crearUsuario);
router.get("/perfil/:cod_usu", tokenValidation, obtenerPerfil);
router.post("/iniciar-sesion", iniciarSesion);
export default router;
