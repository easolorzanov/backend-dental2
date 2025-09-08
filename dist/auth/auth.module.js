"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const usuarios_module_1 = require("../usuarios/usuarios.module");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const roles_module_1 = require("../roles/roles.module");
const pacientes_module_1 = require("../pacientes/pacientes.module");
const dentistas_module_1 = require("../dentistas/dentistas.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, usuarios_module_1.UsuariosModule, roles_module_1.RolesModule, pacientes_module_1.PacientesModule, dentistas_module_1.DentistasModule],
        imports: [
            usuarios_module_1.UsuariosModule,
            roles_module_1.RolesModule,
            passport_1.PassportModule,
            pacientes_module_1.PacientesModule,
            dentistas_module_1.DentistasModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get('EXPIRES_IN'),
                    },
                }),
            }),
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map