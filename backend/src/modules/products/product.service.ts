import { prisma } from '../../database/prisma';
import { CreateProductDTO } from './product.types';

export class ProductService {
  async create(data: CreateProductDTO) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        stock: data.stock,
        imageUrl: data.imageUrl,
      },
    });

    return product;
  }
  async listAll() {
    const products = await prisma.product.findMany({
        orderBy: {
        createdAt: 'desc',
        },
    });

    return products;
  }
  async listActive() {
    const products = await prisma.product.findMany({
        where: {
            active: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return products;
  }
}