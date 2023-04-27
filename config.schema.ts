import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SALT_ROUND: Joi.number().default(10).required(),
});
