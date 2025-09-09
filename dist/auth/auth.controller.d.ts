import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(req: any): Promise<import("../pacientes/entities/paciente.entity").Paciente | import("../dentistas/entities/dentista.entity").Dentista>;
    test(req: any): Promise<any>;
}
