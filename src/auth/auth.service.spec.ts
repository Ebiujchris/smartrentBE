import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn().mockResolvedValue(true),
}));

type PhoneLoginQuery = {
  where: {
    phone: { in: string[] };
    role: { in: string[] };
  };
  include: { subscription: true; tenantProfile: true };
};

describe('AuthService phone login', () => {
  let service: AuthService;
  const prisma = {
    user: {
      findFirst: jest.fn<
        Promise<Record<string, unknown> | null>,
        [PhoneLoginQuery]
      >(),
      findUnique: jest.fn(),
    },
  };
  const jwtService = { sign: jest.fn().mockReturnValue('token') };
  const emailService = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
      email: 'landlord@example.com',
      password: 'hashed-password',
      fullName: 'Landlord',
      role: 'LANDLORD',
      isSuspended: false,
      subscription: null,
      tenantProfile: null,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('finds a landlord by equivalent Ugandan phone number formats', async () => {
    await expect(
      service.login({ email: '+256 701-234-567', password: 'password' }),
    ).resolves.toMatchObject({
      user: { id: 'user-1', role: 'LANDLORD' },
      token: 'token',
    });

    const candidates = prisma.user.findFirst.mock.calls[0]?.[0].where.phone.in;

    expect(candidates).toContain('+256 701-234-567');
    expect(candidates).toContain('256701234567');
    expect(candidates).toContain('0701234567');
    expect(candidates).toContain('+256701234567');
  });
});
