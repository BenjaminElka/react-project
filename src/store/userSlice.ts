import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------- Types ---------- */
export type TImage = {
  url: string;
  alt?: string;
};

export type TAddress = {
  city: string;
  state: string;
  country: string;
  street: string;
  houseNumber: number;
  zip?: string;
};

export type Tuser = {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  email: string;
  phone: string;
  isBusiness: boolean;
  isAdmin: boolean;
  address: TAddress;
  image: TImage;
};

/* ---------- Slice ---------- */
interface UserSliceState {
  user: Tuser | null;
}

const initialState: UserSliceState = { user: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** שמירת אובייקט המשתמש המלא ב-Redux */
    login: (state, action: PayloadAction<Tuser>) => {
      state.user = action.payload;
    },
    /** ניקוי המשתמש (יציאה) */
    logout: (state) => {
      state.user = null;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
