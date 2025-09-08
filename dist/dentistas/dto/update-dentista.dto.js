"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDentistaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dentista_dto_1 = require("./create-dentista.dto");
class UpdateDentistaDto extends (0, mapped_types_1.PartialType)(create_dentista_dto_1.CreateDentistaDto) {
}
exports.UpdateDentistaDto = UpdateDentistaDto;
//# sourceMappingURL=update-dentista.dto.js.map