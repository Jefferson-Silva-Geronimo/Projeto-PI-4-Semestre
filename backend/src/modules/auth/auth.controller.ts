import {Request, Response} from 'express';
import { AuthService } from './auth.service';

export class AuthController{
    private authService = new AuthService();
    
    async register(req: Request, res: Response){
        try{
            const user = await this.authService.register(req.body);
            return res.status(201).json(user);
        }catch(error){
            return res.status(400).json({
                message: error instanceof Error ? error.message : 'Erro ao cadastrar usuário.'
            })
        }
    }
    async login(req: Request, res: Response) {
        try {
            const result = await this.authService.login(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({
                message: error instanceof Error ? error.message : 'Falha ao realizar login.',
            });
        }
    }
    async forgotPassword( req: Request, res: Response) {
        try {
            const result = await this.authService.forgotPassword( req.body );
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
            message: error instanceof Error ? error.message: 'Erro ao gerar token.',
            });
        }
    }
}