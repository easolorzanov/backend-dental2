import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PacientesModule } from './pacientes/pacientes.module';
import { DentistasModule } from './dentistas/dentistas.module';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CitasModule } from './citas/citas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { AuthModule } from './auth/auth.module';
import { ConsultorioModule } from './consultorio/consultorio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DB_CONN'),
        autoLoadEntities: true,
        synchronize: true,
        timezone: 'Etc/UTC',
      })
    }),
    PacientesModule,
    DentistasModule,
    RolesModule,
    UsuariosModule,
    CitasModule,
    ServiciosModule,
    AuthModule,
    ConsultorioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }