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
exports.Servicio = void 0;
const cita_entity_1 = require("../../citas/entities/cita.entity");
const consultorio_entity_1 = require("../../consultorio/entities/consultorio.entity");
const typeorm_1 = require("typeorm");
let Servicio = class Servicio {
};
exports.Servicio = Servicio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Servicio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { unique: true }),
    __metadata("design:type", String)
], Servicio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Servicio.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Servicio.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consultorio_entity_1.Consultorio, (consultorio) => consultorio.servicios),
    __metadata("design:type", consultorio_entity_1.Consultorio)
], Servicio.prototype, "consultorio", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => cita_entity_1.Cita, citas => citas.servicios),
    __metadata("design:type", Array)
], Servicio.prototype, "citas", void 0);
exports.Servicio = Servicio = __decorate([
    (0, typeorm_1.Entity)({ name: 'dtt_servicio' })
], Servicio);
//# sourceMappingURL=servicio.entity.js.map