import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPaymentDto: CreatePaymentDto) {
    const { leaseId, tenantId, amount, dueDate, method, reference, notes } = createPaymentDto;

    const payment = await this.prisma.payment.create({
      data: {
        leaseId,
        tenantId,
        amount,
        dueDate: new Date(dueDate),
        method: method as any,
        reference,
        notes,
        status: 'PENDING',
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

    return payment;
  }

  async findAll(userId: string) {
    const payments = await this.prisma.payment.findMany({
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
        dueDate: 'desc',
      },
    });

    return payments;
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
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

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        amount: updatePaymentDto.amount,
        dueDate: updatePaymentDto.dueDate ? new Date(updatePaymentDto.dueDate) : undefined,
        paidDate: updatePaymentDto.paidDate ? new Date(updatePaymentDto.paidDate) : undefined,
        status: updatePaymentDto.status as any,
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

  async recordPayment(id: string, method: string, reference?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        method: method as any,
        reference,
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

  async getOverduePayments(userId: string) {
    const today = new Date();
    
    const overduePayments = await this.prisma.payment.findMany({
      where: {
        status: {
          in: ['PENDING', 'OVERDUE'],
        },
        dueDate: {
          lt: today,
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

  async remove(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Payment deleted successfully' };
  }
}
