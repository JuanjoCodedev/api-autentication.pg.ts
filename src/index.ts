import app from "./app";
import postgresConexion from "./server/database";

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  postgresConexion;
});
