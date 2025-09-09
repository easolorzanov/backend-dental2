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
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const paciente_entity_1 = require("./entities/paciente.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
let PacientesService = class PacientesService {
    constructor(pacienteRepository, usuarioRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.logger = new common_1.Logger('PacienteService');
    }
    async create(createPacienteDto) {
        const existePaciente = await this.findCedula(createPacienteDto.identificacion);
        if (existePaciente)
            throw new common_1.BadRequestException("Ya existe el Paciente");
        try {
            const paciente = this.pacienteRepository.create(createPacienteDto);
            await this.pacienteRepository.save(paciente);
            return paciente;
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException(error.detail);
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async findOne(id) {
        const paciente = await this.pacienteRepository.findOneBy({ id });
        if (!paciente)
            throw new common_1.NotFoundException(`Paciente ${id} no encontrado`);
        return paciente;
    }
    async findCedula(identificacion) {
        return await this.pacienteRepository.findOneBy({ identificacion });
    }
    async findOneIdUser(usuario) {
        const paciente = await this.pacienteRepository.findOneBy({ usuario });
        if (!paciente)
            throw new common_1.NotFoundException(`Paciente  ${usuario} no encontrado`);
        return paciente;
    }
    async update(id, updatePacienteDto) {
        const paciente = await this.pacienteRepository.preload(Object.assign({ id: id }, updatePacienteDto));
        if (!paciente)
            throw new common_1.NotFoundException(`Paciente ${id} no encontrado`);
        try {
            await this.pacienteRepository.save(paciente);
            return paciente;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const paciente = await this.findOne(id);
        paciente.status = false;
        try {
            await this.pacienteRepository.save(paciente);
            if (paciente.usuario) {
                await this.usuarioRepository.remove(paciente.usuario);
            }
            this.logger.log(`Paciente ${id} eliminado (status = false)`);
            return { message: 'Paciente eliminado exitosamente' };
        }
        catch (error) {
            this.logger.error('Error eliminando paciente:', error);
            throw new common_1.InternalServerErrorException('Error al eliminar el paciente');
        }
    }
    async getPacientePorConsultorio(consultorioId) {
        return await this.pacienteRepository.createQueryBuilder('paciente')
            .leftJoinAndSelect('paciente.consultorio', 'consultorio')
            .where('paciente.consultorio.id = :consultorioId', { consultorioId })
            .andWhere('paciente.status = :status', { status: true })
            .getMany();
    }
};
exports.PacientesService = PacientesService;
exports.PacientesService = PacientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(paciente_entity_1.Paciente)),
    __param(1, (0, typeorm_2.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], PacientesService);
//# sourceMappingURL=pacientes.service.js.map