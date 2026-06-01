"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || message;
                error = exceptionResponse.error || error;
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : exception);
        const sanitizedMessage = this.sanitizeErrorMessage(message);
        const sanitizedError = this.sanitizeErrorMessage(error);
        const errorResponse = {
            statusCode: status,
            message: sanitizedMessage,
            error: sanitizedError,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
            errorResponse.stack = exception.stack;
        }
        response.status(status).json(errorResponse);
    }
    sanitizeErrorMessage(message) {
        if (Array.isArray(message)) {
            return message.map((m) => this.sanitizeSingleMessage(m));
        }
        return this.sanitizeSingleMessage(message);
    }
    sanitizeSingleMessage(message) {
        const sensitivePatterns = [
            /password/gi,
            /token/gi,
            /secret/gi,
            /api[_-]?key/gi,
            /database/gi,
            /connection/gi,
            /prisma/gi,
            /\b\d{3}-\d{2}-\d{4}\b/g,
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        ];
        let sanitized = message;
        sensitivePatterns.forEach((pattern) => {
            sanitized = sanitized.replace(pattern, '[REDACTED]');
        });
        return sanitized;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map