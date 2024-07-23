"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const validate = (schema) => {
    return (req, res, next) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        const { error, value } = schema.validate(req.body, validationOptions);
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(", ");
            logger_1.default.warn(`Validation error: ${errorMessage}`);
            res
                .status(400)
                .json({ error: "ข้อมูลไม่ถูกต้อง", details: errorMessage });
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
exports.default = exports.validate;
//# sourceMappingURL=validationMiddleware.js.map