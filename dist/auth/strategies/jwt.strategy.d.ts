import { Strategy } from 'passport-jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuarioService;
    constructor(usuarioService: UsuariosService);
    validate(payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
export {};
