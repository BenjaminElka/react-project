import axios from "axios";

const BASE = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

export type Card = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  image: { url: string; alt: string };
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
  createdAt: string;
};

/** GET /cards — return every card in the DB */
export const getAllCards = async () => {
  const { data } = await axios.get<Card[]>(`${BASE}/cards`);
  return data;
};
