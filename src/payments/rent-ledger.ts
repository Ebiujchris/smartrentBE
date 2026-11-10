import { BadRequestException } from '@nestjs/common';
import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  RentReceiptType,
} from '@prisma/client';

const moneyToMinorUnits = (amount: Prisma.Decimal | number | string) =>
  Math.round(Number(amount) * 100);

const minorUnitsToMoney = (amount: number) =>
  new Prisma.Decimal(amount).div(100);

function monthlyDate(anchor: Date, monthOffset: number) {
  const monthIndex = anchor.getUTCMonth() + monthOffset;
  const year = anchor.getUTCFullYear() + Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const day = Math.min(
    anchor.getUTCDate(),
    new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
  );
  return new Date(Date.UTC(year, month, day));
}

export function getRentPeriodEnd(startDate: Date, leaseEnd: Date) {
  const start = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    ),
  );
  const periodEnd = monthlyDate(start, 1);
  periodEnd.setUTCDate(periodEnd.getUTCDate() - 1);
  if (periodEnd > leaseEnd) periodEnd.setTime(leaseEnd.getTime());
  return periodEnd;
}

export async function createMonthlyRentCharges(
  tx: Prisma.TransactionClient,
  lease: {
    id: string;
    tenantId: string;
    rentAmount: Prisma.Decimal | number;
    startDate: Date;
    endDate: Date;
  },
) {
  const start = new Date(
    Date.UTC(
      lease.startDate.getUTCFullYear(),
      lease.startDate.getUTCMonth(),
      lease.startDate.getUTCDate(),
    ),
  );
  const end = new Date(
    Date.UTC(
      lease.endDate.getUTCFullYear(),
      lease.endDate.getUTCMonth(),
      lease.endDate.getUTCDate(),
    ),
  );
  const rentAmount = new Prisma.Decimal(lease.rentAmount);
  let periodCount = 0;
  while (monthlyDate(start, periodCount) <= end) periodCount += 1;

  if (periodCount > 120) {
    throw new BadRequestException(
      'Lease terms cannot exceed 120 monthly rent periods',
    );
  }

  for (let month = 0; month < periodCount; month += 1) {
    const periodStart = monthlyDate(start, month);
    const nextPeriodStart = monthlyDate(start, month + 1);
    const periodEnd = new Date(nextPeriodStart);
    periodEnd.setUTCDate(periodEnd.getUTCDate() - 1);
    if (periodEnd > end) periodEnd.setTime(end.getTime());

    const existingCharge = await tx.payment.findFirst({
      where: { leaseId: lease.id, dueDate: periodStart },
      select: { id: true, periodEnd: true },
    });
    if (existingCharge) {
      if (existingCharge.periodEnd?.getTime() !== periodEnd.getTime()) {
        await tx.payment.update({
          where: { id: existingCharge.id },
          data: { periodEnd },
        });
      }
      continue;
    }

    const charge = await tx.payment.create({
      data: {
        leaseId: lease.id,
        tenantId: lease.tenantId,
        amount: rentAmount,
        dueDate: periodStart,
        periodStart,
        periodEnd,
        paidAmount: 0,
        status: PaymentStatus.PENDING,
      },
    });

    await applyRentCreditsToCharge(tx, lease.id, charge);
  }

  return periodCount;
}

export async function applyRentCreditsToCharge(
  tx: Prisma.TransactionClient,
  leaseId: string,
  charge: { id: string; amount: Prisma.Decimal; paidAmount: Prisma.Decimal },
) {
  let outstanding =
    moneyToMinorUnits(charge.amount) - moneyToMinorUnits(charge.paidAmount);
  if (outstanding <= 0) return;

  const credits = await tx.rentReceipt.findMany({
    where: {
      leaseId,
      type: RentReceiptType.RENT,
      unallocatedAmount: { gt: 0 },
    },
    orderBy: { paidAt: 'asc' },
  });

  for (const credit of credits) {
    if (outstanding <= 0) break;
    const available = moneyToMinorUnits(credit.unallocatedAmount);
    const allocated = Math.min(available, outstanding);
    if (allocated <= 0) continue;

    await tx.rentAllocation.create({
      data: {
        receiptId: credit.id,
        paymentId: charge.id,
        amount: minorUnitsToMoney(allocated),
      },
    });
    await tx.rentReceipt.update({
      where: { id: credit.id },
      data: { unallocatedAmount: minorUnitsToMoney(available - allocated) },
    });

    const paidAmount =
      moneyToMinorUnits(charge.amount) - outstanding + allocated;
    outstanding -= allocated;
    await tx.payment.update({
      where: { id: charge.id },
      data: {
        paidAmount: minorUnitsToMoney(paidAmount),
        status:
          paidAmount >= moneyToMinorUnits(charge.amount)
            ? PaymentStatus.PAID
            : PaymentStatus.PARTIALLY_PAID,
        paidDate:
          paidAmount >= moneyToMinorUnits(charge.amount)
            ? credit.paidAt
            : undefined,
      },
    });
  }
}

export async function createRentReceipt(
  tx: Prisma.TransactionClient,
  input: {
    leaseId: string;
    tenantId: string;
    amount: number;
    type?: RentReceiptType;
    paidAt?: Date;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  },
) {
  const type = input.type ?? RentReceiptType.RENT;
  const amount = new Prisma.Decimal(input.amount);
  const receipt = await tx.rentReceipt.create({
    data: {
      leaseId: input.leaseId,
      tenantId: input.tenantId,
      amount,
      type,
      paidAt: input.paidAt ?? new Date(),
      method: input.method,
      reference: input.reference,
      notes: input.notes,
      unallocatedAmount: type === RentReceiptType.RENT ? amount : 0,
    },
  });

  let remaining = type === RentReceiptType.RENT ? moneyToMinorUnits(amount) : 0;
  if (remaining > 0) {
    const charges = await tx.payment.findMany({
      where: {
        leaseId: input.leaseId,
        status: {
          in: [
            PaymentStatus.PENDING,
            PaymentStatus.PARTIALLY_PAID,
            PaymentStatus.OVERDUE,
          ],
        },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
    });

    for (const charge of charges) {
      if (remaining <= 0) break;
      const chargeAmount = moneyToMinorUnits(charge.amount);
      const currentPaid = moneyToMinorUnits(charge.paidAmount);
      const outstanding = chargeAmount - currentPaid;
      if (outstanding <= 0) continue;

      const allocated = Math.min(remaining, outstanding);
      const paidAmount = currentPaid + allocated;
      const isPaid = paidAmount >= chargeAmount;

      await tx.rentAllocation.create({
        data: {
          receiptId: receipt.id,
          paymentId: charge.id,
          amount: minorUnitsToMoney(allocated),
        },
      });
      await tx.payment.update({
        where: { id: charge.id },
        data: {
          paidAmount: minorUnitsToMoney(paidAmount),
          status: isPaid ? PaymentStatus.PAID : PaymentStatus.PARTIALLY_PAID,
          paidDate: isPaid ? receipt.paidAt : null,
          method: isPaid ? input.method : undefined,
          reference: isPaid ? input.reference : undefined,
        },
      });
      remaining -= allocated;
    }

    await tx.rentReceipt.update({
      where: { id: receipt.id },
      data: { unallocatedAmount: minorUnitsToMoney(remaining) },
    });
  }

  return tx.rentReceipt.findUniqueOrThrow({
    where: { id: receipt.id },
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
            select: {
              id: true,
              dueDate: true,
              periodStart: true,
              periodEnd: true,
            },
          },
        },
      },
    },
  });
}
