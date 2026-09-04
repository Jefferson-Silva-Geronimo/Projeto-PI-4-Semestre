import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({
      message: 'Usuário não autenticado.',
    });
  }

  if (user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Acesso negado.',
    });
  }

  next();
}