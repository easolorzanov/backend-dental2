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
exports.Dentista = void 0;
const cita_entity_1 = require("../../citas/entities/cita.entity");
const consultorio_entity_1 = require("../../consultorio/entities/consultorio.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const typeorm_1 = require("typeorm");
let Dentista = class Dentista {
};
exports.Dentista = Dentista;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dentista.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "identificacion", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "especialidad", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Dentista.prototype, "celular", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usuario_entity_1.Usuario, usuario => usuario.dentista, { eager: true, cascade: ['remove'], onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", usuario_entity_1.Usuario)
], Dentista.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cita_entity_1.Cita, cita => cita.dentista),
    __metadata("design:type", Array)
], Dentista.prototype, "citas", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => consultorio_entity_1.Consultorio, (consultorio) => consultorio.id, { eager: true }),
    __metadata("design:type", consultorio_entity_1.Consultorio)
], Dentista.prototype, "consultorio", void 0);
exports.Dentista = Dentista = __decorate([
    (0, typeorm_1.Entity)({ name: 'dtt_dentista' })
], Dentista);
//# sourceMappingURL=dentista.entity.js.map