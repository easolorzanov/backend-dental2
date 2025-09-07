import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'dtt_cita' })
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  fecha: Date;

  @Column('varchar')
  estado: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.citas, { eager: true })
  paciente: Paciente;

  @ManyToOne(() => Dentista, (dentista) => dentista.citas, { eager: true })
  dentista: Dentista;

  @ManyToMany(() => Servicio, (servicios) => servicios.citas, { eager: true })
  @JoinTable({ name: 'cita_servicio' })
  servicios: Servicio[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_pagar: number;

  @Column({ nullable: true, default: 'Sin observaciones' })
  observacion: string;

  @Column({ nullable: true, default: 'Sin recomendaciones' })
  recomendacion: string;

  @Column({ nullable: true })
  diagnostico: string;

  @Column({ nullable: true })
  tratamiento: string;

  @Column({ nullable: true })
  medicamentos: string;

  @Column({ nullable: true })
  instrucciones: string;

  @Column({ nullable: true })
  duracion_real: number; // Duración real en minutos

  @Column({ default: true })
  paciente_asistio: boolean;

  @Column({ nullable: true })
  motivo_no_asistencia: string;

  @Column({ type: 'json', nullable: true })
  servicios_realizados: any; // Array de servicios realizados

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_cobrado: number;

  @Column({ nullable: true })
  metodo_pago: string;

  @Column({ nullable: true })
  proxima_cita: string; // Fecha sugerida para próxima cita

  @Column({ nullable: true })
  urgencia: string; // Nivel de urgencia si aplica

  @Column({ default: false })
  status: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
