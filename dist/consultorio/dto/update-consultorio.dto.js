"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConsultorioDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_consultorio_dto_1 = require("./create-consultorio.dto");
class UpdateConsultorioDto extends (0, mapped_types_1.PartialType)(create_consultorio_dto_1.CreateConsultorioDto) {
}
exports.UpdateConsultorioDto = UpdateConsultorioDto;
//# sourceMappingURL=update-consultorio.dto.js.map