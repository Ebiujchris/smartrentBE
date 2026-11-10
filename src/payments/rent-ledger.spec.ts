import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  RentReceiptType,
} from '@prisma/client';
import { createMonthlyRentCharges, createRentReceipt } from './rent-ledger';

interface ChargeRecord {
  id: string;
  amount: Prisma.Decimal;
  paidAmount: Prisma.Decimal | number;
  dueDate: Date;
  periodStart: Date;
  periodEnd: Date;
  status: PaymentStatus;
  createdAt?: Date;
  paidDate?: Date | null;
  method?: PaymentMethod | null;
  reference?: string | null;
}

interface ReceiptRecord {
  id: string;
  amount: Prisma.Decimal;
  unallocatedAmount: Prisma.Decimal;
  paidAt: Date;
  type: RentReceiptType;
  method: PaymentMethod;
}

interface AllocationRecord {
  receiptId: string;
  paymentId: string;
  amount: Prisma.Decimal;
}

describe('rent ledger', () => {
  it('creates stable monthly periods from a month-end lease start', async () => {
    const charges: ChargeRecord[] = [];
    const tx = createChargeTransaction(charges);

    await createMonthlyRentCharges(tx, {
      id: 'lease-1',
      tenantId: 'tenant-1',
      rentAmount: 100,
      startDate: new Date('2024-01-31T00:00:00.000Z'),
      endDate: new Date('2024-03-31T00:00:00.000Z'),
    });

    expect(
      charges.map((charge) => charge.dueDate.toISOString().slice(0, 10)),
    ).toEqual(['2024-01-31', '2024-02-29', '2024-03-31']);
    expect(
      charges.map((charge) => charge.periodEnd.toISOString().slice(0, 10)),
    ).toEqual(['2024-02-28', '2024-03-30', '2024-03-31']);
  });

  it('adds only missing charges when a lease is extended and updates its final period', async () => {
    const charges: ChargeRecord[] = [];
    const tx = createChargeTransaction(charges);
    const lease = {
      id: 'lease-1',
      tenantId: 'tenant-1',
      rentAmount: 100,
      startDate: new Date('2024-01-31T00:00:00.000Z'),
      endDate: new Date('2024-02-28T00:00:00.000Z'),
    };

    await createMonthlyRentCharges(tx, lease);
    await createMonthlyRentCharges(tx, {
      ...lease,
      endDate: new Date('2024-03-31T00:00:00.000Z'),
    });

    expect(charges).toHaveLength(3);
    expect(charges[1].periodEnd.toISOString().slice(0, 10)).toBe('2024-03-30');
  });

  it('allocates partial rent receipts to the earliest rent periods first', async () => {
    const charges = [
      createCharge('charge-1', '2024-01-01'),
      createCharge('charge-2', '2024-02-01'),
    ];
    const allocations: AllocationRecord[] = [];
    const tx = createReceiptTransaction(charges, allocations);

    await createRentReceipt(tx, {
      leaseId: 'lease-1',
      tenantId: 'tenant-1',
      amount: 150,
      method: PaymentMethod.CASH,
    });

    expect(charges.map((charge) => Number(charge.paidAmount))).toEqual([
      100, 50,
    ]);
    expect(charges.map((charge) => charge.status)).toEqual([
      PaymentStatus.PAID,
      PaymentStatus.PARTIALLY_PAID,
    ]);
    expect(
      allocations.map((allocation) => allocation.amount.toNumber()),
    ).toEqual([100, 50]);
  });

  it('keeps security deposits separate from rent allocations', async () => {
    const charges = [createCharge('charge-1', '2024-01-01')];
    const allocations: AllocationRecord[] = [];
    const tx = createReceiptTransaction(charges, allocations);

    const receipt = await createRentReceipt(tx, {
      leaseId: 'lease-1',
      tenantId: 'tenant-1',
      amount: 100,
      type: RentReceiptType.DEPOSIT,
      method: PaymentMethod.CASH,
    });

    expect(allocations).toHaveLength(0);
    expect(Number(charges[0].paidAmount)).toBe(0);
    expect(receipt.unallocatedAmount.toNumber()).toBe(0);
  });
});

function createCharge(id: string, dueDate: string): ChargeRecord {
  const date = new Date(`${dueDate}T00:00:00.000Z`);
  return {
    id,
    amount: new Prisma.Decimal(100),
    paidAmount: new Prisma.Decimal(0),
    dueDate: date,
    periodStart: date,
    periodEnd: date,
    status: PaymentStatus.PENDING,
    createdAt: date,
  };
}

function createChargeTransaction(
  charges: ChargeRecord[],
): Prisma.TransactionClient {
  return {
    payment: {
      findFirst: jest.fn(({ where }: { where: { dueDate: Date } }) =>
        Promise.resolve(
          charges.find(
            (charge) => charge.dueDate.getTime() === where.dueDate.getTime(),
          ) ?? null,
        ),
      ),
      create: jest.fn(
        ({ data }: { data: Omit<ChargeRecord, 'id' | 'createdAt'> }) => {
          const charge = { ...data, id: `charge-${charges.length + 1}` };
          charges.push(charge);
          return Promise.resolve(charge);
        },
      ),
      update: jest.fn(
        ({
          where,
          data,
        }: {
          where: { id: string };
          data: Partial<ChargeRecord>;
        }) => {
          const charge = charges.find((item) => item.id === where.id);
          if (!charge) throw new Error('Charge not found');
          Object.assign(charge, data);
          return Promise.resolve(charge);
        },
      ),
    },
    rentReceipt: {
      findMany: jest.fn(() => Promise.resolve([])),
    },
  } as unknown as Prisma.TransactionClient;
}

function createReceiptTransaction(
  charges: ChargeRecord[],
  allocations: AllocationRecord[],
): Prisma.TransactionClient {
  let receipt: ReceiptRecord | undefined;
  return {
    rentReceipt: {
      create: jest.fn(
        ({
          data,
        }: {
          data: {
            amount: Prisma.Decimal;
            unallocatedAmount: Prisma.Decimal | number;
            paidAt: Date;
            type: RentReceiptType;
            method: PaymentMethod;
          };
        }) => {
          receipt = {
            ...data,
            amount: new Prisma.Decimal(data.amount),
            unallocatedAmount: new Prisma.Decimal(data.unallocatedAmount),
            id: 'receipt-1',
          };
          return Promise.resolve(receipt);
        },
      ),
      update: jest.fn(
        ({ data }: { data: { unallocatedAmount: Prisma.Decimal } }) => {
          if (!receipt) throw new Error('Receipt not found');
          Object.assign(receipt, data);
          return Promise.resolve(receipt);
        },
      ),
      findUniqueOrThrow: jest.fn(() => {
        if (!receipt) throw new Error('Receipt not found');
        return Promise.resolve(receipt);
      }),
    },
    payment: {
      findMany: jest.fn(() =>
        Promise.resolve(
          charges.filter((charge) =>
            [
              PaymentStatus.PENDING,
              PaymentStatus.PARTIALLY_PAID,
              PaymentStatus.OVERDUE,
            ].some((status) => status === charge.status),
          ),
        ),
      ),
      update: jest.fn(
        ({
          where,
          data,
        }: {
          where: { id: string };
          data: Partial<ChargeRecord>;
        }) => {
          const charge = charges.find((item) => item.id === where.id);
          if (!charge) throw new Error('Charge not found');
          Object.assign(charge, data);
          return Promise.resolve(charge);
        },
      ),
    },
    rentAllocation: {
      create: jest.fn(({ data }: { data: AllocationRecord }) => {
        allocations.push(data);
        return Promise.resolve(data);
      }),
    },
  } as unknown as Prisma.TransactionClient;
}
