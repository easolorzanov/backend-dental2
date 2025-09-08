"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api');
    const allowedOrigins = [
        'http://localhost:8100',
        'https://localhost:8100',
        'capacitor://localhost',
        'ionic://localhost',
        'http://localhost',
        'http://localhost:8080',
        'http://localhost:4200'
    ];
    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Aplicación dental ejecutándose en puerto ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map