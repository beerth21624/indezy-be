import Joi from "joi";

export const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  role: Joi.string().valid("ADMIN", "MANAGER", "OPERATOR").required(),
});



export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
