"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const helmet_1 = __importDefault(require("helmet"));
const platform_express_1 = require("@nestjs/platform-express");
const express_2 = __importDefault(require("express"));
const app_module_1 = require("../src/app.module");
const http_exception_filter_1 = require("../src/common/filters/http-exception.filter");
const transform_interceptor_1 = require("../src/common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("../src/common/interceptors/logging.interceptor");
const server = (0, express_2.default)();
let cachedApp;
async function createApp() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
            logger: ['error', 'warn'],
        });
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
        }));
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                if (origin.includes('.vercel.app') || origin.includes('localhost')) {
                    return callback(null, true);
                }
                callback(null, false);
            },
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: false,
            },
        }));
        app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
        app.use((0, express_1.json)({ limit: '10mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb' }));
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}
exports.default = async (req, res) => {
    await createApp();
    server(req, res);
};
//# sourceMappingURL=index.js.map