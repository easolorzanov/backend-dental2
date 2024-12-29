import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';


@Entity()
export class Cita {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('timestamp')
    fecha: Date;

    @Column('varchar')
    estado: string;

    @ManyToOne(() => Paciente, paciente => paciente.citas)
    paciente: Paciente;

    @ManyToOne(() => Dentista, dentista => dentista.citas)
    dentista: Dentista;

    @ManyToMany(() => Servicio, servicios => servicios.citas, { eager: true })
    @JoinTable({ name: 'cita_servicio' })
    servicios: Servicio[];

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_pagar: number;

    @Column()
    tiempo_total: number;

    @Column({ nullable: true, default: 'Sin observaciones' })
    observacion: string;

    @Column({ nullable: true, default: 'Sin recomendaciones' })
    recomendacion: string;

    //@ManyToOne(() => Servicio, servicios => servicios.citas)
    //@JoinTable()
    //servicios: Servicio[];
}
