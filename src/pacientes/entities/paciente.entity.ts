import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'dtt_paciente' })
export class Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    identificacion: string;

    @Column('varchar')
    nombre: string;

    @Column('varchar')
    apellido: string;

    @Column('varchar', { nullable: true })
    direccion: string;

    @Column('varchar')
    correo: string;

    @Column('varchar')
    celular: string;

    @OneToOne(() => Usuario, usuario => usuario.dentista, { eager: true })
    @JoinColumn()
    usuario: Usuario;

    @OneToMany(() => Cita, cita => cita.paciente)
    citas: Cita[];

    @ManyToOne(() => Consultorio, (consultorio) => consultorio.id, { eager: true })
    consultorio: Consultorio;
}