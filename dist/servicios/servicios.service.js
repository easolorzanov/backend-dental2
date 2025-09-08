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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const servicio_entity_1 = require("./entities/servicio.entity");
let ServiciosService = class ServiciosService {
    constructor(servicioRepository) {
        this.servicioRepository = servicioRepository;
        this.logger = new common_1.Logger('ServiciosService');
    }
    async create(createServicioDto) {
        const existeDentista = await this.findNombre(createServicioDto.nombre);
        if (existeDentista)
            throw new common_1.BadRequestException("Ya existe el Servicio");
        try {
            const servicio = this.servicioRepository.create(createServicioDto);
            await this.servicioRepository.save(servicio);
            return servicio;
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.BadRequestException(error.detail);
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async findAll(consultorioId) {
        const citasC = await this.servicioRepository.createQueryBuilder('servicio')
            .leftJoinAndSelect('servicio.consultorio', 'consultorio')
            .where('servicio.consultorio.id = :consultorioId', { consultorioId })
            .getMany();
        return citasC;
    }
    async update(id, updateServicioDto) {
        const servicio = await this.servicioRepository.preload(Object.assign({ id: id }, updateServicioDto));
        if (!servicio)
            throw new common_1.NotFoundException(`Servicio ${id} no encontrado`);
        try {
            await this.servicioRepository.save(servicio);
            return servicio;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const servicio = await this.servicioRepository.findOne({
            where: { id: id },
        });
        await this.servicioRepository.remove(servicio);
    }
    async findNombre(nombre) {
        return await this.servicioRepository.findOneBy({ nombre });
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map