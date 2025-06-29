/*  src/Pages/Profile/Profile.tsx  */

import axios from "axios";
import {
  Button,
  Card,
  TextInput,   // ⬅️  NEW: replaces deprecated <FloatingLabel>
  Flowbite,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import { TRootState } from "../../store/store";
import { userActions } from "../../store/userSlice";

/* ---------- types & validation ---------- */
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

/* ---------- component ---------- */
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((s: TRootState) => s.userSlice.user);
  const [editMode, setEditMode] = useState(false);

  /*–– log entire user object whenever it changes ––*/
  useEffect(() => {
    console.log("🔎 FULL USER OBJECT →", user);
    console.log("🔎 JSON →\n", JSON.stringify(user, null, 2));
  }, [user]);

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

  /* keep form in sync with user + edit mode */
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

  /* helper to pull Joi messages */
  const err = (k: keyof FormData) => errors[k]?.message;

  if (!user) return null;

  return (
    <Flowbite>
      <div className="flex min-h-screen flex-col items-center gap-6 p-4">
        <h1 className="text-3xl font-bold">פרופיל משתמש</h1>

        {/* ---------- VIEW MODE ---------- */}
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
          /* ---------- EDIT MODE ---------- */
          <Card className="w-full max-w-2xl">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* personal */}
              <TextInput
                id="firstName"
                placeholder=" "
                variant="floating"
                {...register("firstName")}
                color={err("firstName") ? "failure" : undefined}
                helperText={err("firstName")}
              />

              <TextInput
                id="middleName"
                placeholder=" "
                variant="floating"
                {...register("middleName")}
              />

              <TextInput
                id="lastName"
                placeholder=" "
                variant="floating"
                {...register("lastName")}
                color={err("lastName") ? "failure" : undefined}
                helperText={err("lastName")}
              />

              <TextInput
                id="email"
                placeholder=" "
                variant="floating"
                type="email"
                {...register("email")}
                color={err("email") ? "failure" : undefined}
                helperText={err("email")}
              />

              <TextInput
                id="phone"
                placeholder=" "
                variant="floating"
                {...register("phone")}
                color={err("phone") ? "failure" : undefined}
                helperText={err("phone")}
              />

              {/* address */}
              <TextInput
                id="country"
                placeholder=" "
                variant="floating"
                {...register("country")}
              />
              <TextInput
                id="state"
                placeholder=" "
                variant="floating"
                {...register("state")}
              />
              <TextInput
                id="city"
                placeholder=" "
                variant="floating"
                {...register("city")}
              />
              <TextInput
                id="street"
                placeholder=" "
                variant="floating"
                {...register("street")}
              />
              <TextInput
                id="houseNumber"
                placeholder=" "
                variant="floating"
                type="number"
                {...register("houseNumber")}
              />
              <TextInput
                id="zip"
                placeholder=" "
                variant="floating"
                type="number"
                {...register("zip")}
              />

              {/* image */}
              <TextInput
                id="imageUrl"
                placeholder=" "
                variant="floating"
                {...register("imageUrl")}
              />
              <TextInput
                id="imageAlt"
                placeholder=" "
                variant="floating"
                {...register("imageAlt")}
              />

              {/* buttons */}
              <div className="mt-4 flex justify-center gap-4">
                <Button type="submit" disabled={!isValid}>   שמור        </Button>
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
