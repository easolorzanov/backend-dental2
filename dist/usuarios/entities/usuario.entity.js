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
exports.Usuario = void 0;
const dentista_entity_1 = require("../../dentistas/entities/dentista.entity");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
const typeorm_1 = require("typeorm");
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 30, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, rol => rol.usuarios, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'rol_id' }),
    __metadata("design:type", role_entity_1.Role)
], Usuario.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => dentista_entity_1.Dentista, dentista => dentista.usuario),
    __metadata("design:type", dentista_entity_1.Dentista)
], Usuario.prototype, "dentista", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => paciente_entity_1.Paciente, paciente => paciente.usuario),
    __metadata("design:type", paciente_entity_1.Paciente)
], Usuario.prototype, "paciente", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)({ name: 'dtt_user' })
], Usuario);
//# sourceMappingURL=usuario.entity.js.map