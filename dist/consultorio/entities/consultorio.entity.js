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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consultorio = void 0;
const dentista_entity_1 = require("../../dentistas/entities/dentista.entity");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let Consultorio = class Consultorio {
};
exports.Consultorio = Consultorio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Consultorio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Consultorio.prototype, "nombreConsultorio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Consultorio.prototype, "direccionConsultorio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dentista_entity_1.Dentista, (dentista) => dentista.consultorio),
    __metadata("design:type", Array)
], Consultorio.prototype, "dentistas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => paciente_entity_1.Paciente, (paciente) => paciente.consultorio),
    __metadata("design:type", Array)
], Consultorio.prototype, "pacientes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => servicio_entity_1.Servicio, (servicio) => servicio.consultorio),
    __metadata("design:type", Array)
], Consultorio.prototype, "servicios", void 0);
exports.Consultorio = Consultorio = __decorate([
    (0, typeorm_1.Entity)({ name: 'dtt_consultorio' })
], Consultorio);
//# sourceMappingURL=consultorio.entity.js.map