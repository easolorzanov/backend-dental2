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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("./entities/role.entity");
const typeorm_2 = require("typeorm");
let RolesService = class RolesService {
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
        this.logger = new common_1.Logger('RolesService');
    }
    async findName(nombre) {
        return await this.rolesRepository.findOneBy({ nombre });
    }
    async create(createRoleDto) {
        const rolExistente = await this.findName(createRoleDto.nombre);
        if (rolExistente)
            throw new common_1.BadRequestException("Ya existe el Rol");
        try {
            const role = this.rolesRepository.create(createRoleDto);
            await this.rolesRepository.save(role);
            return role;
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException(error.detail);
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async findAll() {
        return await this.rolesRepository.find();
    }
    async findOne(id) {
        const role = await this.rolesRepository.findOneBy({ id });
        if (!role)
            throw new common_1.NotFoundException(`Rol ${id} no encontrado`);
        return role;
    }
    async update(id, updateRoleDto) {
        const role = await this.rolesRepository.preload(Object.assign({ id: id }, updateRoleDto));
        if (!role)
            throw new common_1.NotFoundException(`Rol ${id} no encontrado`);
        try {
            await this.rolesRepository.save(role);
            return role;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const role = await this.findOne(id);
        this.rolesRepository.remove(role);
        return Object.assign(Object.assign({}, role), { id });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map