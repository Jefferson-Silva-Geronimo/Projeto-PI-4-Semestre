"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUserFactory = exports.UserFactory = void 0;
const client_1 = require("@prisma/client");
class UserFactory {
}
exports.UserFactory = UserFactory;
class ClientUserFactory extends UserFactory {
    create(data) {
        return {
            ...data,
            role: client_1.UserRole.CLIENTE,
        };
    }
}
exports.ClientUserFactory = ClientUserFactory;
//# sourceMappingURL=user.factory.js.map