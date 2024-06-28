import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { HistorialClinico } from 'src/historial-clinico/entities/historial-clinico.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,ManyToMany,JoinTable } from 'typeorm';


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

    @ManyToMany(() => Servicio, servicios => servicios.citas)
    @JoinTable({name:'cita_servicio'})
    servicios: Servicio[];
    
    @OneToMany(() => HistorialClinico, historial => historial.cita)
    historiales: HistorialClinico[];  

}
