import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPaymentDates() {
  console.log('Starting payment date fix...');

  try {
    // Find all PAID payments with null paidDate
    const paymentsToFix = await prisma.payment.findMany({
      where: {
        status: 'PAID',
        paidDate: null,
      },
    });

    console.log(`Found ${paymentsToFix.length} payments to fix`);

    // Update each payment to set paidDate to createdAt or current date
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
  } catch (error) {
    console.error('Error fixing payment dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPaymentDates();
