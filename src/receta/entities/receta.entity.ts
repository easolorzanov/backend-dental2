import { HistorialClinico } from 'src/historial-clinico/entities/historial-clinico.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,ManyToMany,JoinTable } from 'typeorm';

@Entity()
export class Receta {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column('varchar')
    medicamento: string;
  
    @Column('int')
    cantidad: number;
  
    @Column('varchar')
    instrucciones: string;
  
    @ManyToOne(() => HistorialClinico, historialClinico => historialClinico.recetas)
    historialClinico: HistorialClinico;
}
