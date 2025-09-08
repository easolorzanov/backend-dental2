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
exports.CitasController = void 0;
const common_1 = require("@nestjs/common");
const citas_service_1 = require("./citas.service");
const create_cita_dto_1 = require("./dto/create-cita.dto");
const update_cita_dto_1 = require("./dto/update-cita.dto");
let CitasController = class CitasController {
    constructor(citasService) {
        this.citasService = citasService;
    }
    create(createCitaDto) {
        return this.citasService.create(createCitaDto);
    }
    actualizarEstados() {
        return this.citasService.actualizarEstadosManual();
    }
    findOne(id) {
        return this.citasService.findOne(id);
    }
    findByDentista(id) {
        return this.citasService.findAllByDentista(id);
    }
    findByPacienteForCalendar(id) {
        return this.citasService.findAllByPacienteForCalendar(id);
    }
    findByPaciente(id) {
        return this.citasService.findAllByPaciente(id);
    }
    update(id, updateCitaDto) {
        return this.citasService.update(id, updateCitaDto);
    }
    remove(id) {
        return this.citasService.remove(id);
    }
    restore(id) {
        return this.citasService.restore(id);
    }
    doneCita(id, completeCitaDto) {
        return this.citasService.doneCita(id, completeCitaDto);
    }
    findHistoricDentista(id) {
        return this.citasService.findHistoricoDentista(id);
    }
    findHistoricPaciente(id) {
        return this.citasService.findHistoricoPaciente(id);
    }
    findHistoricConsultorio(id) {
        return this.citasService.findHistoricoConsultorio(id);
    }
    findLastByPaciente(id) {
        return this.citasService.findLastByPaciente(id);
    }
    findLastByDentista(id) {
        return this.citasService.findLastByDentista(id);
    }
    findProximasCitasDentista(id) {
        return this.citasService.findProximasCitasDentista(id);
    }
    findHistoricAdmin() {
        return this.citasService.findHistoricoAdmin();
    }
    findProximasCitasPaciente(id) {
        return this.citasService.findProximasCitasPaciente(id);
    }
    getEstadisticasAdmin() {
        return this.citasService.getEstadisticasAdmin();
    }
};
exports.CitasController = CitasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cita_dto_1.CreateCitaDto]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('actualizar-estados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "actualizarEstados", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('dentistaId/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByDentista", null);
__decorate([
    (0, common_1.Get)('pacienteId/:id/calendar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByPacienteForCalendar", null);
__decorate([
    (0, common_1.Get)('pacienteId/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByPaciente", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cita_dto_1.UpdateCitaDto]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('restore/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "restore", null);
__decorate([
    (0, common_1.Patch)('/done/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "doneCita", null);
__decorate([
    (0, common_1.Get)('historico-dentista/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findHistoricDentista", null);
__decorate([
    (0, common_1.Get)('historico-paciente/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findHistoricPaciente", null);
__decorate([
    (0, common_1.Get)('historico-consultorio/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findHistoricConsultorio", null);
__decorate([
    (0, common_1.Get)('last-paciente/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findLastByPaciente", null);
__decorate([
    (0, common_1.Get)('last-dentista/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findLastByDentista", null);
__decorate([
    (0, common_1.Get)('proximas-dentista/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findProximasCitasDentista", null);
__decorate([
    (0, common_1.Get)('historico-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findHistoricAdmin", null);
__decorate([
    (0, common_1.Get)('proximas-paciente/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findProximasCitasPaciente", null);
__decorate([
    (0, common_1.Get)('estadisticas/admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "getEstadisticasAdmin", null);
exports.CitasController = CitasController = __decorate([
    (0, common_1.Controller)('cita'),
    __metadata("design:paramtypes", [citas_service_1.CitasService])
], CitasController);
//# sourceMappingURL=citas.controller.js.map