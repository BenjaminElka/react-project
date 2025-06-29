import axios from "axios";
import {
  Button,
  Card,
  FloatingLabel,
  Flowbite,          
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import { TRootState } from "../../store/store";
import { userActions } from "../../store/userSlice";

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  houseNumber: string;
  zip: string;
  imageUrl: string;
  imageAlt: string;
};
const schema = Joi.object<FormData>({
  firstName: Joi.string().min(2).max(20).required(),
  middleName: Joi.string().allow("").max(20),
  lastName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().pattern(/^0[2-9]\d{7,8}$/).required(),
  country: Joi.string().min(2).max(30).required(),
  state: Joi.string().allow("").max(30),
  city: Joi.string().min(2).max(30).required(),
  street: Joi.string().min(2).max(30).required(),
  houseNumber: Joi.string().required(),
  zip: Joi.string().allow("").max(10),
  imageUrl: Joi.string().uri().required(),
  imageAlt: Joi.string().allow("").max(50),
});

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: TRootState) => s.userSlice.user);
  const [editMode, setEditMode] = useState(false);

  /* --- log entire user object on every change --- */
  useEffect(() => {
    console.log("🔎 FULL USER OBJECT →", user);
    console.log("🔎 JSON →\n", JSON.stringify(user, null, 2));
  }, [user]);

  /* --- react-hook-form --- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: joiResolver(schema),
    defaultValues: user
      ? {
          firstName: user.name.first,
          middleName: user.name.middle ?? "",
          lastName: user.name.last,
          email: user.email,
          phone: user.phone,
          country: user.address.country,
          state: user.address.state,
          city: user.address.city,
          street: user.address.street,
          houseNumber: String(user.address.houseNumber),
          zip: String(user.address.zip ?? ""),
          imageUrl: user.image.url,
          imageAlt: user.image.alt ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    if (user)
      reset({
        firstName: user.name.first,
        middleName: user.name.middle ?? "",
        lastName: user.name.last,
        email: user.email,
        phone: user.phone,
        country: user.address.country,
        state: user.address.state,
        city: user.address.city,
        street: user.address.street,
        houseNumber: String(user.address.houseNumber),
        zip: String(user.address.zip ?? ""),
        imageUrl: user.image.url,
        imageAlt: user.image.alt ?? "",
      });
  }, [user, reset, editMode]);

  /* submit handler */
  const onSubmit = async (data: FormData) => {
    if (!user?._id) return;
    try {
      const payload = {
        name: {
          first: data.firstName,
          middle: data.middleName,
          last: data.lastName,
        },
        email: data.email,
        phone: data.phone,
        address: {
          country: data.country,
          state: data.state,
          city: data.city,
          street: data.street,
          houseNumber: +data.houseNumber,
          zip: data.zip ? +data.zip : undefined,
        },
        image: {
          url: data.imageUrl,
          alt: data.imageAlt,
        },
      };

      const { data: updated } = await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${user._id}`,
        payload,
        { headers: { "x-auth-token": localStorage.getItem("token") } },
      );
      dispatch(userActions.login(updated));
      setEditMode(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  
  const err = (k: keyof FormData) => errors[k]?.message;

  if (!user) return null;
  return (
    <Flowbite>
      <div className="flex min-h-screen flex-col items-center gap-6 p-4">
        <h1 className="text-3xl font-bold">פרופיל משתמש</h1>
        {!editMode ? (
          <Card className="w-full max-w-2xl">
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.image.url}
                alt={user.image.alt || user.name.first}
                className="h-32 w-32 rounded-full object-cover shadow-md"
              />
              <h2 className="text-2xl font-semibold">
                {`${user.name.first} ${user.name.middle ?? ""} ${user.name.last}`.replace(
                  /\s+/g,
                  " ",
                )}
              </h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>
                {`${user.address.street} ${user.address.houseNumber}, ${user.address.city}, ${user.address.country}`}
              </p>
              <Button onClick={() => setEditMode(true)}>עריכה</Button>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-2xl">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              {/* personal */}
              <FloatingLabel
                label="שם פרטי"
                {...register("firstName")}
                color={err("firstName") ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{err("firstName")}</span>

              <FloatingLabel label="שם אמצעי" {...register("middleName")} />

              <FloatingLabel
                label="שם משפחה"
                {...register("lastName")}
                color={err("lastName") ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{err("lastName")}</span>

              <FloatingLabel
                label="אימייל"
                {...register("email")}
                color={err("email") ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{err("email")}</span>

              <FloatingLabel
                label="טלפון"
                {...register("phone")}
                color={err("phone") ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{err("phone")}</span>
              <FloatingLabel label="מדינה" {...register("country")} />
              <FloatingLabel label="מחוז" {...register("state")} />
              <FloatingLabel label="עיר" {...register("city")} />
              <FloatingLabel label="רחוב" {...register("street")} />
              <FloatingLabel
                label="מס' בית"
                type="number"
                {...register("houseNumber")}
              />
              <FloatingLabel label="מיקוד" type="number" {...register("zip")} />

              {/* image */}
              <FloatingLabel label="קישור לתמונה" {...register("imageUrl")} />
              <FloatingLabel label="Alt לתמונה" {...register("imageAlt")} />

              {/* buttons */}
              <div className="mt-4 flex justify-center gap-4">
                <Button type="submit" disabled={!isValid}>
                  שמור
                </Button>
                <Button
                  color="light"
                  type="button"
                  onClick={() => setEditMode(false)}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </Flowbite>
  );
};

export default Profile;
