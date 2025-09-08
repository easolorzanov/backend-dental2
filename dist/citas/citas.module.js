"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasModule = void 0;
const common_1 = require("@nestjs/common");
const citas_service_1 = require("./citas.service");
const citas_controller_1 = require("./citas.controller");
const typeorm_1 = require("@nestjs/typeorm");
const cita_entity_1 = require("./entities/cita.entity");
const servicio_entity_1 = require("../servicios/entities/servicio.entity");
const schedule_1 = require("@nestjs/schedule");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
let CitasModule = class CitasModule {
};
exports.CitasModule = CitasModule;
exports.CitasModule = CitasModule = __decorate([
    (0, common_1.Module)({
        controllers: [citas_controller_1.CitasController],
        providers: [citas_service_1.CitasService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cita_entity_1.Cita, servicio_entity_1.Servicio, paciente_entity_1.Paciente]),
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    transport: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: config.get('MAIL_USER'),
                            pass: config.get('MAIL_PASS'),
                        },
                    },
                    defaults: {
                        from: `"No Reply" <${config.get('MAIL_USER')}>`,
                    },
                }),
            })
        ],
    })
], CitasModule);
//# sourceMappingURL=citas.module.js.map