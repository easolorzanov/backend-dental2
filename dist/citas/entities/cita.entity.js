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
exports.Cita = void 0;
const dentista_entity_1 = require("../../dentistas/entities/dentista.entity");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let Cita = class Cita {
};
exports.Cita = Cita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Cita.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Cita.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, (paciente) => paciente.citas, { eager: true }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Cita.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dentista_entity_1.Dentista, (dentista) => dentista.citas, { eager: true }),
    __metadata("design:type", dentista_entity_1.Dentista)
], Cita.prototype, "dentista", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => servicio_entity_1.Servicio, (servicios) => servicios.citas, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'cita_servicio' }),
    __metadata("design:type", Array)
], Cita.prototype, "servicios", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cita.prototype, "total_pagar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 'Sin observaciones' }),
    __metadata("design:type", String)
], Cita.prototype, "observacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 'Sin recomendaciones' }),
    __metadata("design:type", String)
], Cita.prototype, "recomendacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "diagnostico", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "tratamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "medicamentos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "instrucciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Cita.prototype, "duracion_real", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Cita.prototype, "paciente_asistio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "motivo_no_asistencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Cita.prototype, "servicios_realizados", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cita.prototype, "total_cobrado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "metodo_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "proxima_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "urgencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cita.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cita.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Cita.prototype, "deletedAt", void 0);
exports.Cita = Cita = __decorate([
    (0, typeorm_1.Entity)({ name: 'dtt_cita' })
], Cita);
//# sourceMappingURL=cita.entity.js.map