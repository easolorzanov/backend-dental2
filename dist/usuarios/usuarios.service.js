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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const typeorm_2 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
let UsuariosService = class UsuariosService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.logger = new common_1.Logger('UsuarioService');
    }
    async create(createUsuarioDto) {
        try {
            const hash = await this.hashPassword(createUsuarioDto.password);
            const usuario = this.usuarioRepository.create(Object.assign(Object.assign({}, createUsuarioDto), { password: hash }));
            await this.usuarioRepository.save(usuario);
            return usuario;
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException(error.detail);
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async hashPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(10);
        return await (0, bcryptjs_1.hash)(password, salt);
    }
    async findByUsername(username) {
        return await this.usuarioRepository.findOneBy({ username: username });
    }
    async findById(id) {
        return await this.usuarioRepository.findOneBy({ id: id });
    }
    async findAll() {
        return await this.usuarioRepository.find();
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.dentista', 'dentista')
            .leftJoinAndSelect('usuario.paciente', 'paciente')
            .where('usuario.id = :id', { id })
            .getOne();
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
        return usuario;
    }
    async update(id, updateUsuarioDto) {
        const usuario = await this.usuarioRepository.preload(Object.assign({ id: id }, updateUsuarioDto));
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
        try {
            if (updateUsuarioDto.password == null) {
                delete usuario.password;
                await this.usuarioRepository.update(id, usuario);
                return { "message": "Actualizado Correctamente" };
            }
            else {
                const hash = await this.hashPassword(usuario.password);
                const user = Object.assign(Object.assign({}, usuario), { password: hash });
                await this.usuarioRepository.update(id, user);
                return { "message": "Actualizado Correctamente" };
            }
        }
        catch (error) {
            this.logger.error('Error actualizando usuario:', error);
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const usuario = await this.findOne(id);
        this.usuarioRepository.remove(usuario);
        return Object.assign(Object.assign({}, usuario), { id });
    }
    async updatePassword(id, newPassword) {
        const usuario = await this.usuarioRepository.findOneBy({ id });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        if (!newPassword) {
            throw new common_1.BadRequestException('La nueva contraseña no puede estar vacía');
        }
        const hashedNewPassword = await this.hashPassword(newPassword);
        usuario.password = hashedNewPassword;
        try {
            await this.usuarioRepository.save(usuario);
            return { message: 'Contraseña actualizada correctamente' };
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error al actualizar la contraseña');
        }
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map