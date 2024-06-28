import { Cita } from 'src/citas/entities/cita.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,OneToMany } from 'typeorm';

@Entity()
export class Dentista {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    identificacion: string;

    @Column('varchar')
    nombre: string;
  
    @Column('varchar')
    apellido: string;
  
    @Column('varchar')
    especialidad: string;

    @Column('varchar')
    direccion: string;

    @Column('varchar')
    correo: string;

    @Column('varchar')
    celular: string;
  
    @OneToOne(() => Usuario, usuario => usuario.dentista, {eager: true})
    @JoinColumn()
    usuario: Usuario;

    @OneToMany(() => Cita, cita => cita.dentista)
    citas: Cita[];
}
