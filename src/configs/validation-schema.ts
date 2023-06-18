import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().required(),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_DBNAME: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  PRIVATE_KEY: Joi.string().required(),
  MAIL_TRANSPORT: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number(),
});
