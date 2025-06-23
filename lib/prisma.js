"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = global.prisma ||
    new client_1.PrismaClient({
        log: ['error', 'warn'],
        // Remove the connection pool config since it's not valid here
    });
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
exports.default = prisma;
