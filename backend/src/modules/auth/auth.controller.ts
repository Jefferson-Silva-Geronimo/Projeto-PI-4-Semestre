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

}