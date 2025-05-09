import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RolesService } from 'src/roles/roles.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import { DentistasService } from 'src/dentistas/dentistas.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly pacientesService: PacientesService,
    private readonly dentistasService: DentistasService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByUsername(username);
    if (!user) throw new BadRequestException("No existe el usuario o contraseña incorrecta");
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Contraseña incorrecta');
  }

  async login(user: any) {
    const userValid = await this.validateUser(user.username, user.password);

    if (!userValid) throw new BadRequestException('No existe el usuario o contraseña incorrecta');

    const roleName = userValid.role.nombre;

    if (["ADMINISTRADOR", "DENTISTA"].includes(roleName)) {
      const datos = await this.dentistasService.findOneIdUser(userValid)
      const payload = {
        userId: userValid.id,
        username: userValid.username,
        role: userValid.role.nombre,
        nombre: `${datos.nombre} ${datos.apellido}`,
        personId: datos.id,
        especialidad: datos.especialidad,
        consultorio: datos.consultorio.id
      };

      return { access_token: this.jwtService.sign(payload) };
    }

    if (userValid.role.nombre === "PACIENTE") {
      const datos = await this.pacientesService.findOneIdUser(userValid)
      const payload = {
        userId: userValid.id,
        username: userValid.username,
        role: userValid.role.nombre,
        nombre: `${datos.nombre} ${datos.apellido}`,
        personId: datos.id,
        consultorio: datos.consultorio.id
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async register(data: any) {
    const rol = await this.rolesService.findName(data.rol);
    if (!rol) throw new BadRequestException("Rol no existente");

    await this.validateRegister(data);

    const user = await this.usuarioService.create({
      username: data.username,
      password: data.password,
      role: rol,
    });

    const datosPersonales = {
      identificacion: data.identificacion,
      nombre: data.nombre,
      apellido: data.apellido,
      direccion: data.direccion,
      correo: data.correo,
      celular: data.celular,
      consultorio: data.consultorio,
      usuario: user,
    };

    if (data.rol === "PACIENTE") {
      return await this.pacientesService.create(datosPersonales);
    }

    if (["ADMINISTRADOR", "DENTISTA"].includes(data.rol)) {
      return await this.dentistasService.create({
        ...datosPersonales,
        especialidad: data.especialidad,
      });
    }

    throw new BadRequestException("Rol no existente");
  }

  private async validateRegister(data: any) {
    const existeUsername = await this.usuarioService.findByUsername(data.username);
    if (existeUsername) throw new BadRequestException("El nombre de usuario ya se encuentra registrado");

    if (data.rol === "CLIENTE") {
      const existeCliente = await this.pacientesService.findCedula(data.identificacion);
      if (existeCliente) throw new BadRequestException("La cedula ya se encuentra registrada");
    }

    if (["ADMINISTRADOR", "DENTISTA"].includes(data.rol)) {
      const existeDentista = await this.dentistasService.findCedula(data.identificacion);
      if (existeDentista) throw new BadRequestException("La cedula ya se encuentra registrada");
    }
  }

}