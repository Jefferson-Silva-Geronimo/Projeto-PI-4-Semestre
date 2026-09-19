"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static #instance;
    constructor() { }
    static get instance() {
        if (!AuthController.#instance) {
            AuthController.#instance = new AuthController();
        }
        return AuthController.#instance;
    }
    authService = auth_service_1.AuthService.instance;
    async register(req, res) {
        try {
            const user = await this.authService.register(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao cadastrar usuário.",
            });
        }
    }
    async login(req, res) {
        try {
            const result = await this.authService.login(req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({
                message: error instanceof Error ? error.message : "Falha ao realizar login.",
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            const result = await this.authService.forgotPassword(req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao gerar token.",
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const result = await this.authService.resetPassword(req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao redefinir senha.",
            });
        }
    }
    async me(req, res) {
        try {
            const user = await this.authService.me(req.user.userId);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(404).json({
                message: error instanceof Error ? error.message : "Usuário não encontrado.",
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map