
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Label,
  TextInput,
  Checkbox,          
} from "flowbite-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SignUpJoiSchema } from "../../validations/SignUpSchema.joi";

/* ---------- types ---------- */
export type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  houseNumber: string;
  zip: string;
  isBusiness: boolean;          // ⬅️  חדש
};

export default function Register() {
  const navigate = useNavigate();

  /* ---------- react-hook-form ---------- */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
      isBusiness: false,        // ⬅️  ברירת מחדל
    },
    mode: "onChange",
    resolver: joiResolver(SignUpJoiSchema), // ‼️ ראה הערה למטה
  });

  /* ---------- submit ---------- */
  const onSubmit = async (data: FormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("סיסמה ואימות סיסמה אינם תואמים");
        return;
      }

      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        {
          email: data.email,
          password: data.password,
          phone: data.phone,
          name: {
            first: data.firstName,
            middle: data.middleName,
            last: data.lastName,
          },
          image: { url: "" },
          address: {
            country: data.country,
            state: data.state,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
            zip: data.zip,
          },
          isBusiness: data.isBusiness,     // ⬅️  הערך מהטופס
          isAdmin: false,
        },
      );

      toast.success("הרשמה הושלמה בהצלחה");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      toast.error("הרשמה נכשלה, נסה שוב");
    }
  };

  /* ---------- helper ---------- */
  const renderInput = (
    id: keyof FormData,
    label: string,
    type: React.HTMLInputTypeAttribute = "text",
  ) => (
    <div>
      <Label htmlFor={id} value={label} />
      <TextInput
        id={id}
        type={type}
        {...register(id)}
        color={errors[id] ? "failure" : "gray"}
        helperText={
          <span className="text-red-500">{errors[id]?.message as string}</span>
        }
      />
    </div>
  );

  /* ---------- JSX ---------- */
  return (
    <form
      className="m-auto mt-20 flex w-full max-w-xl flex-col gap-4 rounded-lg p-4 shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold text-gray-800">הרשמה</h1>

      {renderInput("firstName", "שם פרטי")}
      {renderInput("middleName", "שם אמצעי")}
      {renderInput("lastName", "שם משפחה")}
      {renderInput("email", "Email", "email")}
      {renderInput("password", "Password", "password")}
      {renderInput("confirmPassword", "Confirm Password", "password")}
      {renderInput("phone", "טלפון")}
      {renderInput("country", "מדינה")}
      {renderInput("state", "מחוז")}
      {renderInput("city", "עיר")}
      {renderInput("street", "רחוב")}
      {renderInput("houseNumber", "מספר בית")}
      {renderInput("zip", "מיקוד")}

      {/* Business checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox id="isBusiness" {...register("isBusiness")} />
        <Label htmlFor="isBusiness" value="חשבוני הוא עסקי (Business Account)" />
      </div>

      <Button type="submit" disabled={!isValid}>
        Register
      </Button>
    </form>
  );
}
