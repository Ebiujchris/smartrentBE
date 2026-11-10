import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Prisma, RentReceiptType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RecordRentReceiptDto } from './dto/record-rent-receipt.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  applyRentCreditsToCharge,
  createRentReceipt,
  getRentPeriodEnd,
} from './rent-ledger';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private paymentOwnerScope(user: { id: string; role: string }): Prisma.PaymentWhereInput {
    if (user.role === 'ADMIN') return {};
    if (user.role === 'TENANT') return { tenant: { userId: user.id } };
    return { lease: { unit: { property: { ownerId: user.id } } } };
  }

  async create(user: { id: string; role: string }, createPaymentDto: CreatePaymentDto) {
    const { leaseId, tenantId, amount, dueDate, method, reference, notes } =
      createPaymentDto;

    const lease = await this.prisma.lease.findFirst({
      where: {
        id: leaseId,
        tenantId,
        ...(user.role === 'ADMIN'
          ? {}
          : { unit: { property: { ownerId: user.id } } }),
      },
      select: { id: true, endDate: true },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    const chargeDate = new Date(dueDate);
    if (chargeDate > lease.endDate) {
      throw new BadRequestException('Rent due date cannot be after the lease end date');
    }

    const payment = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.payment.findFirst({
        where: { leaseId, dueDate: chargeDate, status: { not: PaymentStatus.CANCELLED } },
        select: { id: true },
      });
      if (existing) {
        throw new BadRequestException('A rent charge already exists for this due date');
      }

      const periodEnd = getRentPeriodEnd(chargeDate, lease.endDate);

      const created = await tx.payment.create({
        data: {
          leaseId,
          tenantId,
          amount,
          dueDate: chargeDate,
          periodStart: chargeDate,
          periodEnd,
          paidAmount: 0,
          method: method as PaymentMethod,
          reference,
          notes,
          status: PaymentStatus.PENDING,
        },
      });
      await applyRentCreditsToCharge(tx, leaseId, created);

      return tx.payment.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          lease: {
            include: {
              unit: { include: { property: true } },
            },
          },
          tenant: { include: { user: true } },
          allocations: { include: { receipt: true } },
        },
      });
    });

    return payment;
  }

  async findAll(userId: string) {
    // First, check if user is a tenant or landlord
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenantProfile: true,
        properties: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let payments;

    if (user.role === 'TENANT' && user.tenantProfile) {
      // Tenants can only see their own payments
      payments = await this.prisma.payment.findMany({
        where: {
          tenantId: user.tenantProfile.id,
        },
        include: {
          lease: {
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
          tenant: {
            include: {
              user: true,
            },
          },
          allocations: { include: { receipt: true } },
        },
        orderBy: {
          dueDate: 'desc',
        },
      });
    } else if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
      // Landlords can see payments for their properties
      payments = await this.prisma.payment.findMany({
        where: {
          lease: {
            unit: {
              property: {
                ownerId: userId,
              },
            },
          },
        },
        include: {
          lease: {
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
          tenant: {
            include: {
              user: true,
            },
          },
          allocations: { include: { receipt: true } },
        },
        orderBy: {
          dueDate: 'desc',
        },
      });
    } else {
      // Admins or other roles see all payments
      payments = await this.prisma.payment.findMany({
        include: {
          lease: {
            include: {
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
          tenant: {
            include: {
              user: true,
            },
          },
          allocations: { include: { receipt: true } },
        },
        orderBy: {
          dueDate: 'desc',
        },
      });
    }

    // Convert Decimal to number
    return payments.map((payment) => ({
      ...payment,
      amount: payment.amount.toNumber(),
      paidAmount: payment.paidAmount.toNumber(),
      outstandingAmount: Math.max(0, payment.amount.toNumber() - payment.paidAmount.toNumber()),
      lease: {
        ...payment.lease,
        rentAmount: payment.lease.rentAmount.toNumber(),
        deposit: payment.lease.deposit.toNumber(),
      },
    }));
  }

  async findByTenantId(tenantId: string, user: { id: string; role: string }) {
    const payments = await this.prisma.payment.findMany({
      where: { tenantId, ...this.paymentOwnerScope(user) },
      include: {
        lease: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
        allocations: { include: { receipt: true } },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    return payments;
  }

  async findOne(id: string, user: { id: string; role: string }) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ...this.paymentOwnerScope(user) },
      include: {
        lease: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
        allocations: { include: { receipt: true } },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, user: { id: string; role: string }) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ...this.paymentOwnerScope(user) },
      include: { lease: { select: { endDate: true } } },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (updatePaymentDto.status !== undefined || updatePaymentDto.paidDate !== undefined) {
      throw new BadRequestException('Payment status and paid date are managed by rent receipts');
    }

    const changesAmount = updatePaymentDto.amount !== undefined &&
      updatePaymentDto.amount !== Number(payment.amount);
    if (changesAmount && Number(payment.paidAmount) > 0) {
      throw new BadRequestException('A charge with recorded rent allocations cannot be repriced');
    }
    if (updatePaymentDto.dueDate && Number(payment.paidAmount) > 0) {
      throw new BadRequestException('A charge with recorded rent allocations cannot be rescheduled');
    }

    if ((changesAmount || updatePaymentDto.dueDate) && Number(payment.paidAmount) === 0) {
      const allocated = await this.prisma.rentAllocation.findFirst({
        where: { paymentId: id },
        select: { id: true },
      });
      if (allocated) {
        throw new BadRequestException('A charge with rent allocations cannot be repriced or rescheduled');
      }
    }

    if (updatePaymentDto.dueDate) {
      const dueDate = new Date(updatePaymentDto.dueDate);
      if (dueDate > payment.lease.endDate) {
        throw new BadRequestException('Rent due date cannot be after the lease end date');
      }
      const duplicate = await this.prisma.payment.findFirst({
        where: {
          id: { not: id },
          leaseId: payment.leaseId,
          dueDate,
          status: { not: PaymentStatus.CANCELLED },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new BadRequestException('A rent charge already exists for this due date');
      }
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        amount: updatePaymentDto.amount,
        dueDate: updatePaymentDto.dueDate
          ? new Date(updatePaymentDto.dueDate)
          : undefined,
        periodStart: updatePaymentDto.dueDate
          ? new Date(updatePaymentDto.dueDate)
          : undefined,
        periodEnd: updatePaymentDto.dueDate
          ? getRentPeriodEnd(new Date(updatePaymentDto.dueDate), payment.lease.endDate)
          : undefined,
        method: updatePaymentDto.method as any,
        reference: updatePaymentDto.reference,
        notes: updatePaymentDto.notes,
      },
      include: {
        lease: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return updated;
  }

  async recordPayment(
    id: string,
    user: { id: string; role: string },
    method: string,
    reference?: string,
    notes?: string,
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ...this.paymentOwnerScope(user) },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const outstanding = Math.max(0, Number(payment.amount) - Number(payment.paidAmount));
    if (outstanding === 0) {
      throw new BadRequestException('This rent charge is already fully paid');
    }

    await this.prisma.$transaction((tx) =>
      createRentReceipt(tx, {
        leaseId: payment.leaseId,
        tenantId: payment.tenantId,
        amount: outstanding,
        method: method as PaymentMethod,
        reference,
        notes,
      }),
    );

    return this.findOne(id, user);
  }

  async recordRentReceipt(
    dto: RecordRentReceiptDto,
    user: { id: string; role: string },
  ) {
    const lease = await this.prisma.lease.findFirst({
      where: {
        id: dto.leaseId,
        ...(user.role === 'ADMIN'
          ? {}
          : { unit: { property: { ownerId: user.id } } }),
      },
      select: {
        id: true,
        tenantId: true,
        deposit: true,
        rentReceipts: {
          where: { type: RentReceiptType.DEPOSIT },
          select: { amount: true },
        },
      },
    });
    if (!lease) throw new NotFoundException('Lease not found');

    const type = dto.type ?? RentReceiptType.RENT;
    if (type === RentReceiptType.DEPOSIT) {
      const depositPaid = lease.rentReceipts.reduce(
        (total, receipt) => total.plus(receipt.amount),
        new Prisma.Decimal(0),
      );
      if (depositPaid.plus(dto.amount).gt(lease.deposit)) {
        throw new BadRequestException('Deposit received cannot exceed the agreed security deposit');
      }
    }

    return this.prisma.$transaction((tx) =>
      createRentReceipt(tx, {
        leaseId: lease.id,
        tenantId: lease.tenantId,
        amount: dto.amount,
        type,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        method: dto.method,
        reference: dto.reference,
        notes: dto.notes,
      }),
    );
  }

  async getRentReceipts(user: { id: string; role: string }) {
    const where: Prisma.RentReceiptWhereInput = user.role === 'ADMIN'
      ? {}
      : user.role === 'TENANT'
        ? { tenant: { userId: user.id } }
        : { lease: { unit: { property: { ownerId: user.id } } } };

    return this.prisma.rentReceipt.findMany({
      where,
      include: {
        lease: {
          include: {
            unit: { include: { property: true } },
          },
        },
        tenant: { include: { user: true } },
        allocations: {
          include: {
            payment: {
              select: { dueDate: true, periodStart: true, periodEnd: true },
            },
          },
        },
      },
      orderBy: { paidAt: 'desc' },
    });
  }

  async getOverduePayments(userId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const whereClause: any = {
      status: {
        in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'],
      },
      dueDate: {
        lt: today,
      },
    };

    // Filter by landlord's properties
    if (user.role === 'LANDLORD' || user.role === 'PROPERTY_MANAGER') {
      whereClause.lease = {
        unit: {
          property: {
            ownerId: userId,
          },
        },
      };
    }

    const overduePayments = await this.prisma.payment.findMany({
      where: whereClause,
      include: {
        lease: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Update status to OVERDUE
    for (const payment of overduePayments) {
      if (payment.status === 'PENDING') {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'OVERDUE' },
        });
      }
    }

    return overduePayments;
  }

  async remove(id: string, user: { id: string; role: string }) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ...this.paymentOwnerScope(user) },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (Number(payment.paidAmount) > 0) {
      throw new BadRequestException('A charge with recorded rent allocations cannot be deleted');
    }
    const allocation = await this.prisma.rentAllocation.findFirst({
      where: { paymentId: id },
      select: { id: true },
    });
    if (allocation) {
      throw new BadRequestException('A charge with rent allocations cannot be deleted');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Payment deleted successfully' };
  }
}
