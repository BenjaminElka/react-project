import Joi from "joi";

export const SignUpJoiSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "יש להזין שם פרטי",
    "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
  }),
  middleName: Joi.string().allow("").max(100).messages({
    "string.max": "שם אמצעי ארוך מדי",
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "יש להזין שם משפחה",
    "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "יש להזין אימייל",
    "string.email": "פורמט אימייל לא תקין",
  }),
  password: Joi.string().pattern(
    new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=(.*\\d){4,})(?=.*[!@%$#^&*\\-_]).{8,}$")
  ).required().messages({
    "string.empty": "יש להזין סיסמה",
    "string.pattern.base": "הסיסמה חייבת לכלול לפחות אות גדולה, אות קטנה, 4 מספרים, תו מיוחד ואורכה לפחות 8 תווים",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "סיסמה ואימות סיסמה חייבים להיות זהים",
    "string.empty": "אנא אמת את הסיסמה",
  }),
  phone: Joi.string().min(9).required().messages({
    "string.empty": "יש להזין טלפון",
    "string.min": "מספר טלפון קצר מדי",
  }),
  country: Joi.string().required().messages({ "string.empty": "יש להזין מדינה" }),
  state: Joi.string().required().messages({ "string.empty": "יש להזין מחוז" }),
  city: Joi.string().required().messages({ "string.empty": "יש להזין עיר" }),
  street: Joi.string().required().messages({ "string.empty": "יש להזין רחוב" }),
  houseNumber: Joi.string().required().messages({ "string.empty": "יש להזין מספר בית" }),
  zip: Joi.string().required().messages({ "string.empty": "יש להזין מיקוד" }),
});