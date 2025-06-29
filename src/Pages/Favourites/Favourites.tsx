// src/pages/Favourites.tsx
import axios from "axios";
import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TRootState } from "../../store/store";
import { CardData } from "../Home/Home";



/* ---------- Component ---------- */
const Favourites = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const nav = useNavigate();

  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );
  const user = useSelector((state: TRootState) => state.userSlice.user);

  /* ---------- Fetch liked cards ---------- */
  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        const { data } = await axios.get<CardData[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        );
        /* keep only liked */
        const liked = data.filter((c) => c.likes.includes(user._id));
        setCards(liked);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    })();
  }, [user?._id]);

  /* ---------- Helpers ---------- */
  const filterBySearch = () =>
    cards.filter(
      (c) =>
        c.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchWord.toLowerCase()),
    );

  /* Toggle like (here it always means “un-like”) */
  const toggleLike = async (card: CardData) => {
    try {
      await axios.patch<CardData>(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${card._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      /* remove from favourites list locally */
      setCards((prev) => prev.filter((c) => c._id !== card._id));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const phoneIcon = (
    <svg
      stroke="currentColor"
      fill="currentColor"
      viewBox="0 0 16 16"
      className="cursor-pointer"
      height="1em"
      width="1em"
    >
      <path
        fillRule="evenodd"
        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
      />
    </svg>
  );

  /* Heart SVG in two states */
  const Heart = ({ filled }: { filled: boolean }) => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      viewBox="0 0 512 512"
      className={`${filled ? "text-red-500" : "text-gray-400"} cursor-pointer`}
      height="1em"
      width="1em"
    >
      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
    </svg>
  );

  /* ---------- JSX ---------- */
  return (
    <div className="flex flex-col items-center justify-start gap-2">
      <h1 className="text-2xl">Favourites Page</h1>

      <div className="cards-container grid gap-4">
        {filterBySearch().map((card) => (
          <Card key={card._id} className="relative">
            {/* image */}
            <img
              src={card.image.url}
              alt={card.image.alt || card.title}
              className="h-40 w-full object-cover"
              onClick={() => nav(`/card/${card._id}`)}
            />

            {/* titles */}
            <h2>{card.title}</h2>
            <h3 className="text-gray-500">{card.subtitle}</h3>

            {/* icons row */}
            <div className="mt-4 flex justify-between text-xl md:text-3xl">
              {/* phone */}
              <a href={`tel:${card.phone}`} title="Call now">
                {phoneIcon}
              </a>

              {/* unlike (heart) */}
              <button
                onClick={() => toggleLike(card)}
                title="Remove from favourites"
              >
                <Heart filled />
              </button>
            </div>

            {/* details button */}
            <Button className="mt-4" onClick={() => nav(`/card/${card._id}`)}>
              See Details
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
