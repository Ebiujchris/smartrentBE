import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@smartrentug.com';
  const password = process.argv[3] || 'Admin@123456';
  const fullName = process.argv[4] || 'System Administrator';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists!`);
      console.log(`User ID: ${existingUser.id}`);
      console.log(`Name: ${existingUser.fullName}`);
      console.log(`Role: ${existingUser.role}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
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
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          },
        },
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${fullName}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
