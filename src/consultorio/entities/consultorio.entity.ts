import { Dentista } from "src/dentistas/entities/dentista.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'dtt_consultorio' })
export class Consultorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombreConsultorio: string;

    @Column()
    direccionConsultorio: string;

    @OneToMany(() => Dentista, (dentista) => dentista.consultorio)
    dentistas: Dentista[];

    @OneToMany(() => Paciente, (paciente) => paciente.consultorio)
    pacientes: Paciente[];

    @OneToMany(() => Servicio, (servicio) => servicio.consultorio)
    servicios: Servicio[];
}