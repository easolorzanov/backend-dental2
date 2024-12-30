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
    //console.log(userValid)
    if (!userValid) {
      throw new BadRequestException('No existe el usuario o contraseña incorrecta');
    }
    if (userValid.role.nombre == "ADMINISTRADOR") {
      //console.log(userValid.id)
      const datos = await this.dentistasService.findOneIdUser(userValid)
      //console.log(datos)
      const payload = {
        userId: userValid.id, username: userValid.username, role: userValid.role.nombre, nombre: `${datos.nombre} ${datos.apellido}`, personId: datos.id,
        especialidad: datos.especialidad, consultorio: datos.consultorio.id
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    if (userValid.role.nombre == "CLIENTE") {
      //console.log(userValid.id)
      const datos = await this.pacientesService.findOneIdUser(userValid)
      const payload = { userId: userValid.id, username: userValid.username, role: userValid.role.nombre, nombre: `${datos.nombre} ${datos.apellido}`, personId: datos.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async register(data: any) {
    if (data.rol == "CLIENTE") {
      const existePaciente = await this.pacientesService.findCedula(data.identificacion);
      if (existePaciente) {
        throw new BadRequestException("La cedula ya se encuentra registrada")
      }
      const existeUsername = await this.usuarioService.findByUsername(data.username);
      if (existeUsername) {
        throw new BadRequestException("El nombre de usuario ya se encuentra registrado")
      }
      const rol: any = await this.rolesService.findName(data.rol)
      //console.log(rol.id)
      const user = {
        "username": data.username,
        "password": data.password,
        "role": rol.id
      }
      const newUser = await this.usuarioService.create(user);
      const datosPersonales = {
        "identificacion": data.identificacion,
        "nombre": data.nombre,
        "apellido": data.apellido,
        "direccion": data.direccion,
        "correo": data.correo,
        "celular": data.celular,
        "usuario": newUser
      }
      const registro = await this.pacientesService.create(datosPersonales);
      return registro;
    }

    if (data.rol == "ADMINISTRADOR") {
      const existeDentista = await this.dentistasService.findCedula(data.identificacion);
      if (existeDentista) {
        throw new BadRequestException("La cedula ya se encuentra registrada")
      }
      const existeUsername = await this.usuarioService.findByUsername(data.username);
      if (existeUsername) {
        throw new BadRequestException("El nombre de usuario ya se encuentra registrado")
      }
      const rol: any = await this.rolesService.findName(data.rol)
      //console.log(rol.id)
      const user = {
        "username": data.username,
        "password": data.password,
        "role": rol.id
      }
      const newUser = await this.usuarioService.create(user);
      const datosPersonales = {
        "identificacion": data.identificacion,
        "nombre": data.nombre,
        "apellido": data.apellido,
        "especialidad": data.especialidad,
        "direccion": data.direccion,
        "correo": data.correo,
        "celular": data.celular,
        "usuario": newUser
      }
      const registro = await this.dentistasService.create(datosPersonales);
      return registro;
    }
    return new BadRequestException("Rol no existente")


  }
}