import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany,OneToMany } from 'typeorm';


@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  nombre: string;

  @Column('varchar')
  descripcion: string;


  @OneToMany(() => Usuario, usuario => usuario.role)
  usuarios: Usuario[];
}