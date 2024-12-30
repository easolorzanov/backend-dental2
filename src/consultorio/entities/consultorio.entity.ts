import { Dentista } from "src/dentistas/entities/dentista.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consultorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombreConsultorio: string;

    @Column()
    direccionConsultorio: string;

    @OneToMany(() => Dentista, (dentista) => dentista.consultorio)
    dentistas: Dentista[];
}