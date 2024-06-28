import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesModule } from 'src/roles/roles.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { DentistasModule } from 'src/dentistas/dentistas.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsuariosModule,RolesModule,PacientesModule,DentistasModule ],
  imports: [
    UsuariosModule, // Importa el módulo de usuario
    RolesModule,
    PassportModule,
    PacientesModule,
    DentistasModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('EXPIRES_IN'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
