"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function main() {
    const email = process.argv[2] || 'admin@smartrentug.com';
    const password = process.argv[3] || 'Admin@123456';
    const fullName = 'System Administrator';
    const prisma = new client_1.PrismaClient({
        log: ['error'],
    });
    try {
        await prisma.$connect();
        console.log('Connected to database...');
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword, role: 'ADMIN' },
            });
            console.log('\n✅ User updated to ADMIN with new password!');
        }
        else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName,
                    role: 'ADMIN',
                    subscription: {
                        create: {
                            plan: 'PREMIUM',
                            status: 'ACTIVE',
                            maxUnits: 999999,
                            amount: 0,
                            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
            });
            console.log('\n✅ Admin user created!');
        }
        console.log(`\n📧 Login Credentials:`);
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${password}`);
    }
    catch (err) {
        console.error('Error:', err.message);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed-admin.js.map