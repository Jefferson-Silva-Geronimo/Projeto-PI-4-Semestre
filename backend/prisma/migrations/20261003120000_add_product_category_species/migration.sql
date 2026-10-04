-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('RACAO', 'PETISCOS', 'HIGIENE', 'BRINQUEDOS', 'ACESSORIOS', 'FARMACIA');

-- CreateEnum
CREATE TYPE "public"."Species" AS ENUM ('CAO', 'GATO', 'OUTRO');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "category" "public"."ProductCategory" NOT NULL DEFAULT 'ACESSORIOS',
ADD COLUMN     "species" "public"."Species";
