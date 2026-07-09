import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const email = process.argv[2] || 'admin@smartrentug.com';
const password = process.argv[3] || 'Admin@123456';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('Connected to database...');

    const hashedPassword = await bcryptjs.hash(password, 10);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, role: 'ADMIN' },
      });
      console.log('\n✅ User updated to ADMIN with new password!');
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: 'System Administrator',
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

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
