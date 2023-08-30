import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("usuarios") // Nombre de la tabla en la base de datos
export class Usuario {
  @PrimaryGeneratedColumn()
  cod_usu!: number;

  @Column()
  nombre_usu!: string;

  @Column()
  correo_usu!: string;

  @Column()
  contrasena_usu!: string;

  @Column()
  telefono_usu!: string;

  @Column()
  direccion_usu!: string;

  @Column()
  cargo_usu!: string;
}
