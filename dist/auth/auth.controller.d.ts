import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(req: any): Promise<import("../dentistas/entities/dentista.entity").Dentista | import("../pacientes/entities/paciente.entity").Paciente>;
    test(req: any): Promise<any>;
}
