import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        phone: registerDto.phone,
        role: registerDto.role || 'LANDLORD',
      },
    });

    // Create default trial subscription for landlords/property managers
    if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 days free trial

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await this.prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'STARTER',
          status: 'TRIAL',
          maxUnits: 10,
          trialEndsAt: trialEndDate,
          currentPeriodEnd: periodEnd,
          amount: 75000,
        },
      });
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        subscription: true,
        tenantProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscription: user.subscription,
        tenantProfile: user.tenantProfile,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
        subscription: true,
        tenantProfile: true,
      },
    });

    return user;
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
}
