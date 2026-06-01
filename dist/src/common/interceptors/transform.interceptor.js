"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            return this.sanitizeResponse(data);
        }));
    }
    sanitizeResponse(data) {
        if (!data)
            return data;
        if (data && typeof data === 'object' && typeof data.toNumber === 'function') {
            return data.toNumber();
        }
        if (Array.isArray(data)) {
            return data.map((item) => this.sanitizeResponse(item));
        }
        if (typeof data === 'object') {
            const sanitized = { ...data };
            if ('password' in sanitized) {
                delete sanitized.password;
            }
            const internalFields = ['__v', '_id'];
            internalFields.forEach((field) => {
                if (field in sanitized) {
                    delete sanitized[field];
                }
            });
            Object.keys(sanitized).forEach((key) => {
                sanitized[key] = this.sanitizeResponse(sanitized[key]);
            });
            return sanitized;
        }
        return data;
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map