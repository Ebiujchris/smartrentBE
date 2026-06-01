"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function fixPaymentDates() {
    console.log('Starting payment date fix...');
    try {
        const paymentsToFix = await prisma.payment.findMany({
            where: {
                status: 'PAID',
                paidDate: null,
            },
        });
        console.log(`Found ${paymentsToFix.length} payments to fix`);
        for (const payment of paymentsToFix) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    paidDate: payment.createdAt || new Date(),
                },
            });
            console.log(`Fixed payment ${payment.id}`);
        }
        console.log('Payment date fix completed successfully!');
    }
    catch (error) {
        console.error('Error fixing payment dates:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
fixPaymentDates();
//# sourceMappingURL=fix-payment-dates.js.map