"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
function adminMiddleware(req, res, next) {
    const user = req.user;
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
//# sourceMappingURL=admin.middleware.js.map