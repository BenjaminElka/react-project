// src/pages/CardDetails.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "flowbite-react";

/* ---------- Type Definitions ---------- */
interface CardImage {
  url: string;
  alt: string;
}
interface Address {
  street: string;
  houseNumber: number;
  city: string;
  state?: string;
  country: string;
  zip?: number;
}
interface CardData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web?: string;
  image: CardImage;
  address: Address;
  bizNumber: number;
  createdAt: string;
}

/* ---------- Component ---------- */
const CardDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CardData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<CardData>(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        );
        setCard(data);
      } catch (err) {
        console.error("Error fetching card details:", err);
      }
    })();
  }, [id]);

  if (!card) return <p className="mt-10 text-center">טוען…</p>;

  /* Build address and iframe URL */
  const fullAddress = `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress,
  )}&output=embed`;

  return (
    <div className="flex justify-center px-4 py-6">
      <Card className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-lg">
        {/* Hero Image */}
        <img
          src={card.image.url}
          alt={card.image.alt}
          className="h-72 w-full object-cover"
        />

        {/* Main Content */}
        <div className="space-y-4 p-6">
          <header>
            <h1 className="text-3xl font-bold">{card.title}</h1>
            <h2 className="text-xl text-gray-600">{card.subtitle}</h2>
          </header>

          <p className="text-gray-800">{card.description}</p>

          {/* Contact & Address Section */}
          <section className="space-y-1 text-sm">
            <p>
              <strong>טלפון:</strong>{" "}
              <a href={`tel:${card.phone}`} className="text-blue-600 underline">
                {card.phone}
              </a>
            </p>
            <p>
              <strong>אימייל:</strong>{" "}
              <a
                href={`mailto:${card.email}`}
                className="text-blue-600 underline"
              >
                {card.email}
              </a>
            </p>
            {card.web && (
              <p>
                <strong>אתר:</strong>{" "}
                <a
                  href={card.web}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {card.web}
                </a>
              </p>
            )}

            {/* Address + Map (close together) */}
            <p>
              <strong>כתובת:</strong> {fullAddress}
            </p>
            <div className="mt-2 h-60 w-full overflow-hidden rounded-lg shadow-inner">
              <iframe
                title="business-location"
                src={mapSrc}
                loading="lazy"
                className="size-full border-0"
              />
            </div>

            <p>
              <strong>מס’ עסק:</strong> {card.bizNumber}
            </p>
            <p>
              <strong>נוצר בתאריך:</strong>{" "}
              {new Date(card.createdAt).toLocaleDateString("he-IL")}
            </p>
          </section>

          {/* Call-to-Action Buttons */}
          <div className="flex gap-2">
            <Button as="a" href={`tel:${card.phone}`}>
              התקשר עכשיו
            </Button>
            {card.web && (
              <Button as="a" href={card.web} target="_blank" color="gray">
                בקר באתר
              </Button>
            )}
            <Button color="light" onClick={() => window.history.back()}>
              חזרה
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardDetails;
