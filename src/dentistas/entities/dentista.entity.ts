import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

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

    @OneToOne(() => Usuario, usuario => usuario.dentista, { eager: true, cascade: ['remove'], onDelete: 'CASCADE' })
    @JoinColumn()
    usuario: Usuario;

    @OneToMany(() => Cita, cita => cita.dentista)
    citas: Cita[];

    @ManyToOne(() => Consultorio, (consultorio) => consultorio.id, {eager: true})
    consultorio: Consultorio;
}
