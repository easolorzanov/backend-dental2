"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentistasModule = void 0;
const common_1 = require("@nestjs/common");
const dentistas_service_1 = require("./dentistas.service");
const dentistas_controller_1 = require("./dentistas.controller");
const dentista_entity_1 = require("./entities/dentista.entity");
const typeorm_1 = require("@nestjs/typeorm");
const consultorio_entity_1 = require("../consultorio/entities/consultorio.entity");
let DentistasModule = class DentistasModule {
};
exports.DentistasModule = DentistasModule;
exports.DentistasModule = DentistasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                dentista_entity_1.Dentista, consultorio_entity_1.Consultorio
            ])],
        controllers: [dentistas_controller_1.DentistasController],
        providers: [dentistas_service_1.DentistasService],
        exports: [dentistas_service_1.DentistasService]
    })
], DentistasModule);
//# sourceMappingURL=dentistas.module.js.map