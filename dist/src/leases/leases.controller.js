"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeasesController = void 0;
const common_1 = require("@nestjs/common");
const leases_service_1 = require("./leases.service");
const create_lease_dto_1 = require("./dto/create-lease.dto");
const update_lease_dto_1 = require("./dto/update-lease.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let LeasesController = class LeasesController {
    leasesService;
    constructor(leasesService) {
        this.leasesService = leasesService;
    }
    create(user, createLeaseDto) {
        return this.leasesService.create(user.id, createLeaseDto);
    }
    findAll(user) {
        return this.leasesService.findAll(user.id);
    }
    findOne(id, user) {
        return this.leasesService.findOne(id, user);
    }
    update(id, updateLeaseDto, user) {
        return this.leasesService.update(id, updateLeaseDto, user);
    }
    terminate(id, user) {
        return this.leasesService.terminate(id, user);
    }
    remove(id, user) {
        return this.leasesService.remove(id, user);
    }
};
exports.LeasesController = LeasesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lease_dto_1.CreateLeaseDto]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lease_dto_1.UpdateLeaseDto, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/terminate'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "terminate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "remove", null);
exports.LeasesController = LeasesController = __decorate([
    (0, common_1.Controller)('leases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leases_service_1.LeasesService])
], LeasesController);
//# sourceMappingURL=leases.controller.js.map