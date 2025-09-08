"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCitaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cita_dto_1 = require("./create-cita.dto");
class UpdateCitaDto extends (0, mapped_types_1.PartialType)(create_cita_dto_1.CreateCitaDto) {
}
exports.UpdateCitaDto = UpdateCitaDto;
//# sourceMappingURL=update-cita.dto.js.map