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
exports.DentistasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dentista_entity_1 = require("./entities/dentista.entity");
const typeorm_2 = require("typeorm");
let DentistasService = class DentistasService {
    constructor(dentistaRepository) {
        this.dentistaRepository = dentistaRepository;
        this.logger = new common_1.Logger('DentistaService');
    }
    async create(createDentistaDto) {
        const existeDentista = await this.findCedula(createDentistaDto.identificacion);
        if (existeDentista) {
            throw new common_1.BadRequestException("Ya existe el Dentista");
        }
        try {
            const dentista = this.dentistaRepository.create(createDentistaDto);
            await this.dentistaRepository.save(dentista);
            return dentista;
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException(error.detail);
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async findCedula(identificacion) {
        return await this.dentistaRepository.findOneBy({ identificacion });
    }
    async findOne(id) {
        const dentista = await this.dentistaRepository.findOneBy({ id });
        if (!dentista)
            throw new common_1.NotFoundException(`Dentista ${id} no encontrado`);
        return dentista;
    }
    async findOneIdUser(usuario) {
        const paciente = await this.dentistaRepository.findOneBy({ usuario });
        if (!paciente)
            throw new common_1.NotFoundException(`Dentista ${usuario} no encontrado`);
        return paciente;
    }
    async update(id, updateDentistaDto) {
        const dentista = await this.dentistaRepository.preload(Object.assign({ id: id }, updateDentistaDto));
        if (!dentista)
            throw new common_1.NotFoundException(`Paciente ${id} no encontrado`);
        try {
            await this.dentistaRepository.save(dentista);
            return dentista;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const dentista = await this.dentistaRepository.findOne({
            where: { id: id },
            relations: ['usuario'],
        });
        await this.dentistaRepository.remove(dentista);
    }
    async dentistaByConsultorio(consultorioId) {
        const dentistaConsultorio = await this.dentistaRepository.createQueryBuilder('dentistas')
            .leftJoinAndSelect('dentistas.consultorio', 'consultorio')
            .where('dentistas.consultorio.id = :consultorioId', { consultorioId })
            .getMany();
        return dentistaConsultorio;
    }
    async getEspecialidades() {
        const especialidades = [
            'Odontología General',
            'Ortodoncia',
            'Endodoncia',
            'Periodoncia',
            'Cirugía Oral y Maxilofacial',
            'Odontopediatría',
            'Prostodoncia',
            'Implantología',
            'Estética Dental',
            'Radiología Dental',
            'Patología Oral',
            'Medicina Oral'
        ];
        return especialidades;
    }
};
exports.DentistasService = DentistasService;
exports.DentistasService = DentistasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dentista_entity_1.Dentista)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DentistasService);
//# sourceMappingURL=dentistas.service.js.map