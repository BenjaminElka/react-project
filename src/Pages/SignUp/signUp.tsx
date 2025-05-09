import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SignUpJoiSchema } from "../../validations/SignUpSchema.joi"
type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: joiResolver(SignUpJoiSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // מוודא ש־password ו־confirmPassword זהים
      if (data.password !== data.confirmPassword) {
        toast.error("סיסמה ואימות סיסמה אינם תואמים");
        return;
      }

      // קריאה ל־API להרשמה
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/register",
        {
          name: data.fullName,
          email: data.email,
          password: data.password,
        },
      );

      toast.success("הרשמה הושלמה בהצלחה");
      navigate("/login"); // מפנה לדף ההתחברות
    } catch (err) {
      console.error(err);
      toast.error("הרשמה נכשלה, נסה שוב");
    }
  };

  return (
    <form
      className="m-auto mt-20 flex w-2/5 flex-col gap-4 rounded-lg p-4 shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold text-gray-800">הרשמה</h1>

      <FloatingLabel
        type="text"
        variant="outlined"
        label="שם מלא"
        {...register("fullName")}
        color={errors.fullName ? "error" : "success"}
      />
      <span className="text-sm text-red-500">{errors.fullName?.message}</span>

      <FloatingLabel
        type="email"
        variant="outlined"
        label="Email"
        {...register("email")}
        color={errors.email ? "error" : "success"}
      />
      <span className="text-sm text-red-500">{errors.email?.message}</span>

      <FloatingLabel
        type="password"
        variant="outlined"
        label="Password"
        {...register("password")}
        color={errors.password ? "error" : "success"}
      />
      <span className="text-sm text-red-500">{errors.password?.message}</span>

      <FloatingLabel
        type="password"
        variant="outlined"
        label="Confirm Password"
        {...register("confirmPassword")}
        color={errors.confirmPassword ? "error" : "success"}
      />
      <span className="text-sm text-red-500">
        {errors.confirmPassword?.message}
      </span>

      <Button type="submit" disabled={!isValid}>
        Register
      </Button>
    </form>
  );
}