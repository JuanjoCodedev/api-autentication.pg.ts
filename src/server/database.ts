import { Client } from "pg";

export const postgresConexion = new Client({
  host: "localhost",
  user: "postgres",
  port: 4000,
  password: "",
  database: "",
});

postgresConexion.connect();

export default postgresConexion;
