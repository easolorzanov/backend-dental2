import { Cita } from 'src/citas/entities/cita.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class Servicio {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar',{unique:true})
    nombre: string;
  
    @Column('varchar')
    descripcion: string;
  
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    precio: number;
    
    @ManyToMany(() => Cita, citas => citas.servicios)
    citas: Cita[];
  
    //@OneToMany(() => Cita, cita => cita.servicios)
    //citas: Cita[];
}
