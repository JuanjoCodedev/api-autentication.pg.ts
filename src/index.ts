import app from "./app";
import appDataSource from "./server/database";

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  appDataSource;
});
