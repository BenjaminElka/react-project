// src/validations/SignupSchema.joi.ts

import Joi from "joi";

export const SignUpJoiSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "שדה שם מלא חובה למלא",
      "string.min": "שם מלא חייב להכיל לפחות תו אחד",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "שדה אימייל חובה למלא",
      "string.email": "פורמט אימייל לא תקין",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=(.*\\d){4,})(?=.*[!@%$#^&*\\-_]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "שדה סיסמה חובה למלא",
      "string.pattern.base":
        "הסיסמה חייבת לכלול לפחות אות גדולה, אות קטנה, 4 מספרים, תו מיוחד ואורכה לפחות 8 תווים",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "סיסמה ואימות סיסמה חייבים להיות זהים",
      "string.empty": "אנא אמת את הסיסמה",
    }),
});