import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne ,ManyToOne,JoinColumn} from 'typeorm';


@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar',{length: 30, unique:true})
  username: string;

  @Column('varchar')
  password: string;


  @ManyToOne(() => Role, rol => rol.usuarios, {eager: true})
  @JoinColumn({name:'rol_id'})
  role: Role;

  @OneToOne(() => Dentista, dentista => dentista.usuario)
  dentista: Dentista;

  @OneToOne(() => Paciente, paciente => paciente.usuario)
  paciente: Paciente;
}