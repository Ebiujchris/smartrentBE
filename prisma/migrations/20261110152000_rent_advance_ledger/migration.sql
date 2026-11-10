CREATE TYPE "RentReceiptType" AS ENUM ('RENT', 'DEPOSIT');
CREATE TYPE "RentReminderType" AS ENUM ('RENT_DUE', 'LEASE_END');
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIALLY_PAID';

ALTER TABLE "leases"
ADD COLUMN "upfrontMonths" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "payments"
ADD COLUMN "periodStart" TIMESTAMP(3),
ADD COLUMN "periodEnd" TIMESTAMP(3),
ADD COLUMN "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;

UPDATE "payments"
SET "paidAmount" = "amount"
WHERE "status" = 'PAID';

CREATE TABLE "rent_receipts" (
  "id" TEXT NOT NULL,
  "leaseId" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "type" "RentReceiptType" NOT NULL DEFAULT 'RENT',
  "amount" DECIMAL(10,2) NOT NULL,
  "unallocatedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "method" "PaymentMethod" NOT NULL,
  "reference" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rent_receipts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "rent_receipts_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "leases"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "rent_receipts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "rent_receipts_leaseId_paidAt_idx" ON "rent_receipts"("leaseId", "paidAt");
CREATE INDEX "rent_receipts_tenantId_paidAt_idx" ON "rent_receipts"("tenantId", "paidAt");

CREATE TABLE "rent_allocations" (
  "id" TEXT NOT NULL,
  "receiptId" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rent_allocations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "rent_allocations_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "rent_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "rent_allocations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "rent_allocations_receiptId_paymentId_key" ON "rent_allocations"("receiptId", "paymentId");
CREATE INDEX "rent_allocations_paymentId_idx" ON "rent_allocations"("paymentId");

CREATE TABLE "rent_reminders" (
  "id" TEXT NOT NULL,
  "leaseId" TEXT NOT NULL,
  "type" "RentReminderType" NOT NULL,
  "targetDate" DATE NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rent_reminders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "rent_reminders_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "leases"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "rent_reminders_leaseId_type_targetDate_key" ON "rent_reminders"("leaseId", "type", "targetDate");

INSERT INTO "rent_receipts" (
  "id", "leaseId", "tenantId", "type", "amount", "unallocatedAmount",
  "paidAt", "method", "reference", "notes", "createdAt"
)
SELECT
  'legacy-receipt-' || p."id",
  p."leaseId",
  p."tenantId",
  'RENT',
  p."amount",
  0,
  COALESCE(p."paidDate", p."dueDate"),
  COALESCE(p."method", 'OTHER'::"PaymentMethod"),
  p."reference",
  p."notes",
  p."createdAt"
FROM "payments" p
WHERE p."status" = 'PAID';

INSERT INTO "rent_allocations" ("id", "receiptId", "paymentId", "amount", "createdAt")
SELECT
  'legacy-allocation-' || p."id",
  'legacy-receipt-' || p."id",
  p."id",
  p."amount",
  p."createdAt"
FROM "payments" p
WHERE p."status" = 'PAID';
