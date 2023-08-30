import { DataSource } from "typeorm";
import { Usuario } from "../model/user";

const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 4000,
  username: "postgres",
  password: "",
  database: "",
  synchronize: false,
  entities: [Usuario],
  logging: true,
});

appDataSource.initialize();

export default appDataSource;
