"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const usuarios_service_1 = require("../usuarios/usuarios.service");
const roles_service_1 = require("../roles/roles.service");
const pacientes_service_1 = require("../pacientes/pacientes.service");
const dentistas_service_1 = require("../dentistas/dentistas.service");
let AuthService = class AuthService {
    constructor(usuarioService, rolesService, pacientesService, dentistasService, jwtService) {
        this.usuarioService = usuarioService;
        this.rolesService = rolesService;
        this.pacientesService = pacientesService;
        this.dentistasService = dentistasService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        const user = await this.usuarioService.findByUsername(username);
        if (!user)
            throw new common_1.BadRequestException("No existe el usuario o contraseña incorrecta");
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        throw new common_1.UnauthorizedException('Contraseña incorrecta');
    }
    async login(user) {
        const userValid = await this.validateUser(user.username, user.password);
        if (!userValid)
            throw new common_1.BadRequestException('No existe el usuario o contraseña incorrecta');
        const roleName = userValid.role.nombre;
        if (["ADMINISTRADOR", "DENTISTA"].includes(roleName)) {
            const datos = await this.dentistasService.findOneIdUser(userValid);
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
            const datos = await this.pacientesService.findOneIdUser(userValid);
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
    async register(data) {
        const rol = await this.rolesService.findName(data.rol);
        if (!rol)
            throw new common_1.BadRequestException("Rol no existente");
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
            return await this.dentistasService.create(Object.assign(Object.assign({}, datosPersonales), { especialidad: data.especialidad }));
        }
        throw new common_1.BadRequestException("Rol no existente");
    }
    async validateRegister(data) {
        const existeUsername = await this.usuarioService.findByUsername(data.username);
        if (existeUsername)
            throw new common_1.BadRequestException("El nombre de usuario ya se encuentra registrado");
        if (data.rol === "PACIENTE") {
            const existePaciente = await this.pacientesService.findCedula(data.identificacion);
            if (existePaciente)
                throw new common_1.BadRequestException("La cedula ya se encuentra registrada");
        }
        if (["ADMINISTRADOR", "DENTISTA"].includes(data.rol)) {
            const existeDentista = await this.dentistasService.findCedula(data.identificacion);
            if (existeDentista)
                throw new common_1.BadRequestException("La cedula ya se encuentra registrada");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        roles_service_1.RolesService,
        pacientes_service_1.PacientesService,
        dentistas_service_1.DentistasService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map