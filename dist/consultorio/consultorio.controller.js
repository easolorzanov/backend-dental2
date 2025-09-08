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
exports.ConsultorioController = void 0;
const common_1 = require("@nestjs/common");
const consultorio_service_1 = require("./consultorio.service");
const create_consultorio_dto_1 = require("./dto/create-consultorio.dto");
const update_consultorio_dto_1 = require("./dto/update-consultorio.dto");
let ConsultorioController = class ConsultorioController {
    constructor(consultorioService) {
        this.consultorioService = consultorioService;
    }
    create(createConsultorioDto) {
        return this.consultorioService.create(createConsultorioDto);
    }
    findAll() {
        return this.consultorioService.findAll();
    }
    findOne(id) {
        return this.consultorioService.findOne(+id);
    }
    update(id, updateConsultorioDto) {
        return this.consultorioService.update(+id, updateConsultorioDto);
    }
    remove(id) {
        return this.consultorioService.remove(+id);
    }
};
exports.ConsultorioController = ConsultorioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultorio_dto_1.CreateConsultorioDto]),
    __metadata("design:returntype", void 0)
], ConsultorioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsultorioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultorioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultorio_dto_1.UpdateConsultorioDto]),
    __metadata("design:returntype", void 0)
], ConsultorioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsultorioController.prototype, "remove", null);
exports.ConsultorioController = ConsultorioController = __decorate([
    (0, common_1.Controller)('consultorio'),
    __metadata("design:paramtypes", [consultorio_service_1.ConsultorioService])
], ConsultorioController);
//# sourceMappingURL=consultorio.controller.js.map