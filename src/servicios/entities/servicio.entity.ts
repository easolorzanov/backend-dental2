import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'dtt_servicio' })
export class Servicio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { unique: true })
    nombre: string;

    @Column('varchar')
    descripcion: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    precio: number;

    @ManyToOne(() => Consultorio, (consultorio) => consultorio.servicios)
    consultorio: Consultorio;

    @ManyToMany(() => Cita, citas => citas.servicios)
    citas: Cita[];
}