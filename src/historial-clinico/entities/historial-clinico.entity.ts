import { Cita } from 'src/citas/entities/cita.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Receta } from 'src/receta/entities/receta.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,ManyToMany,JoinTable } from 'typeorm';

@Entity()
export class HistorialClinico {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar')
    descripcion: string;
  
    @ManyToOne(() => Paciente, paciente => paciente.historiales)
    paciente: Paciente;
  
    @ManyToOne(() => Cita, cita => cita.historiales)
    cita: Cita;

    @OneToMany(() => Receta, receta => receta.historialClinico)
    recetas: Receta[];
}
