import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const email = process.argv[2] || 'admin@smartrentug.com';
  const password = process.argv[3] || 'Admin@123456';
  const fullName = 'System Administrator';

  const prisma = new PrismaClient({
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
    } else {
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

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
