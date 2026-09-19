import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  private paymentService = new PaymentService();

  async createPreference(req: Request, res: Response) {
    try {
      const user = (req as any).user as { userId: string };
      const preference = await this.paymentService.createPreference(
        req.body,
        user.userId,
      );

      return res.status(201).json(preference);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao criar preferência de pagamento.",
      });
    }
  }
}
