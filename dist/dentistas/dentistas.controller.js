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
exports.DentistasController = void 0;
const common_1 = require("@nestjs/common");
const dentistas_service_1 = require("./dentistas.service");
const create_dentista_dto_1 = require("./dto/create-dentista.dto");
const update_dentista_dto_1 = require("./dto/update-dentista.dto");
let DentistasController = class DentistasController {
    constructor(dentistasService) {
        this.dentistasService = dentistasService;
    }
    create(createDentistaDto) {
        return this.dentistasService.create(createDentistaDto);
    }
    getEspecialidades() {
        return this.dentistasService.getEspecialidades();
    }
    findOne(id) {
        return this.dentistasService.findOne(id);
    }
    update(id, updateDentistaDto) {
        return this.dentistasService.update(id, updateDentistaDto);
    }
    remove(id) {
        return this.dentistasService.remove(id);
    }
    dentistaByConsultorio(consultorioId) {
        return this.dentistasService.dentistaByConsultorio(consultorioId);
    }
};
exports.DentistasController = DentistasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dentista_dto_1.CreateDentistaDto]),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('especialidades'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "getEspecialidades", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dentista_dto_1.UpdateDentistaDto]),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('consultorio/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DentistasController.prototype, "dentistaByConsultorio", null);
exports.DentistasController = DentistasController = __decorate([
    (0, common_1.Controller)('dentista'),
    __metadata("design:paramtypes", [dentistas_service_1.DentistasService])
], DentistasController);
//# sourceMappingURL=dentistas.controller.js.map