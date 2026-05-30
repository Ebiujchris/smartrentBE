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
exports.VacantListingsController = void 0;
const common_1 = require("@nestjs/common");
const vacant_listings_service_1 = require("./vacant-listings.service");
const create_vacant_listing_dto_1 = require("./dto/create-vacant-listing.dto");
const update_vacant_listing_dto_1 = require("./dto/update-vacant-listing.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let VacantListingsController = class VacantListingsController {
    vacantListingsService;
    constructor(vacantListingsService) {
        this.vacantListingsService = vacantListingsService;
    }
    create(user, createVacantListingDto) {
        return this.vacantListingsService.create(user.id, createVacantListingDto);
    }
    findAllPublic(bedrooms, minPrice, maxPrice, location) {
        return this.vacantListingsService.findAllPublic({
            bedrooms,
            minPrice,
            maxPrice,
            location,
        });
    }
    findMyListings(user) {
        return this.vacantListingsService.findMyListings(user.id);
    }
    findOne(id) {
        return this.vacantListingsService.findOne(id);
    }
    update(id, user, updateVacantListingDto) {
        return this.vacantListingsService.update(id, user.id, updateVacantListingDto);
    }
    remove(id, user) {
        return this.vacantListingsService.remove(id, user.id);
    }
    incrementViewCount(id) {
        return this.vacantListingsService.incrementViewCount(id);
    }
};
exports.VacantListingsController = VacantListingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.LANDLORD, client_1.UserRole.PROPERTY_MANAGER, client_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_vacant_listing_dto_1.CreateVacantListingDto]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('bedrooms', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('minPrice', new common_1.ParseFloatPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('maxPrice', new common_1.ParseFloatPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('my-listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.LANDLORD, client_1.UserRole.PROPERTY_MANAGER, client_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "findMyListings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.LANDLORD, client_1.UserRole.PROPERTY_MANAGER, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_vacant_listing_dto_1.UpdateVacantListingDto]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.LANDLORD, client_1.UserRole.PROPERTY_MANAGER, client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/increment-view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VacantListingsController.prototype, "incrementViewCount", null);
exports.VacantListingsController = VacantListingsController = __decorate([
    (0, common_1.Controller)('vacant-listings'),
    __metadata("design:paramtypes", [vacant_listings_service_1.VacantListingsService])
], VacantListingsController);
//# sourceMappingURL=vacant-listings.controller.js.map