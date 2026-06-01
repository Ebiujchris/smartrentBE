"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SanitizeMiddleware = class SanitizeMiddleware {
    use(req, res, next) {
        if (req.body) {
            req.body = this.sanitize(req.body);
        }
        if (req.query) {
            req.query = this.sanitize(req.query);
        }
        if (req.params) {
            req.params = this.sanitize(req.params);
        }
        next();
    }
    sanitize(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return this.sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitize(item));
        }
        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = this.sanitize(obj[key]);
            }
        }
        return sanitized;
    }
    sanitizeString(value) {
        if (typeof value !== 'string') {
            return value;
        }
        let sanitized = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
        sanitized = sanitized
            .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '')
            .replace(/(-{2}|\/\*|\*\/)/g, '');
        return sanitized;
    }
};
exports.SanitizeMiddleware = SanitizeMiddleware;
exports.SanitizeMiddleware = SanitizeMiddleware = __decorate([
    (0, common_1.Injectable)()
], SanitizeMiddleware);
//# sourceMappingURL=sanitize.middleware.js.map