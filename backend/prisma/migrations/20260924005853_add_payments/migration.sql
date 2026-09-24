-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('MERCADO_PAGO');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'REFUNDED');

-- AlterEnum
ALTER TYPE "public"."OrderStatus" ADD VALUE 'PENDING_PAYMENT';

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "public"."PaymentProvider" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amountInCents" INTEGER NOT NULL,
    "externalReference" TEXT NOT NULL,
    "preferenceId" TEXT,
    "providerPaymentId" TEXT,
    "providerStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_externalReference_key" ON "public"."payments"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_preferenceId_key" ON "public"."payments"("preferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerPaymentId_key" ON "public"."payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payments_orderId_createdAt_idx" ON "public"."payments"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "payments_status_createdAt_idx" ON "public"."payments"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
