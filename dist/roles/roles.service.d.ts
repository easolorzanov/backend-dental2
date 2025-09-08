import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
export declare class RolesService {
    private readonly rolesRepository;
    private readonly logger;
    constructor(rolesRepository: Repository<Role>);
    findName(nombre: string): Promise<Role>;
    create(createRoleDto: CreateRoleDto): Promise<Role>;
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        usuarios: import("../usuarios/entities/usuario.entity").Usuario[];
    }>;
}
