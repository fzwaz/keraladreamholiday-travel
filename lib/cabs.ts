export type CabVehicle = {
  slug: string;
  name: string;
  seats: string;
  tagline: string;
  features: string[];
  /** Expected photo location — add `public/images/cabs/<slug>.webp` to show it. */
  image: string;
  /** Descriptive alt text so vehicle photos are discoverable in image search. */
  alt: string;
};

const img = (slug: string) => `/images/cabs/${slug}.webp`;

export const CAB_VEHICLES: CabVehicle[] = [
  {
    slug: "sedan",
    name: "Sedan",
    seats: "4 + 1 seats",
    tagline: "Swift Dzire or similar — best for couples and airport runs.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("sedan"),
    alt: "Sedan taxi with driver for Kerala cab service — ideal for Kochi airport transfers and Munnar day trips",
  },
  {
    slug: "ertiga",
    name: "Ertiga",
    seats: "6 + 1 seats",
    tagline: "Roomy 7-seater for small families with luggage.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("ertiga"),
    alt: "Maruti Ertiga rental in Kerala — 7-seater family cab with luggage space for Alleppey and Thekkady tours",
  },
  {
    slug: "bolero",
    name: "Bolero",
    seats: "7 seats",
    tagline: "Tough SUV for hill roads and Wayanad trails.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("bolero"),
    alt: "Mahindra Bolero SUV taxi for Kerala hill routes — sturdy cab for Wayanad and Munnar high ranges",
  },
  {
    slug: "innova",
    name: "Innova",
    seats: "7 + 1 seats",
    tagline: "The Kerala tour classic — comfort for long drives.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("innova"),
    alt: "Toyota Innova hire in Kerala — comfortable 7-seater cab for multi-day Kerala tour packages",
  },
  {
    slug: "innova-crysta",
    name: "Innova Crysta",
    seats: "7 + 1 seats",
    tagline: "Premium Innova with captain seats for extra comfort.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("innova-crysta"),
    alt: "Toyota Innova Crysta premium taxi Kerala — captain-seat cab for honeymoon and luxury travel",
  },
  {
    slug: "tempo-traveller-10-12",
    name: "Tempo Traveller 10/12 Seat",
    seats: "10–12 seats",
    tagline: "Compact tempo for group tours and weddings.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("tempo-traveller-10-12"),
    alt: "10 and 12 seater Tempo Traveller rental Kerala — group cab for Kochi sightseeing and pilgrim tours",
  },
  {
    slug: "tempo-traveller-17",
    name: "Tempo Traveller 17 Seat",
    seats: "17 seats",
    tagline: "Mid-size tempo for school trips and events.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("tempo-traveller-17"),
    alt: "17 seater Tempo Traveller hire Kerala — school, college and corporate group travel cab",
  },
  {
    slug: "tempo-traveller-26",
    name: "Tempo Traveller 26 Seat",
    seats: "26 seats",
    tagline: "Large tempo for big groups and tour parties.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("tempo-traveller-26"),
    alt: "26 seater Tempo Traveller Kerala — large group tour bus for Rameshwaram and Madurai circuits",
  },
  {
    slug: "urbania",
    name: "Urbania",
    seats: "17 seats",
    tagline: "Premium Force Urbania van — quiet, tall, comfortable.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("urbania"),
    alt: "Force Urbania premium van rental Kerala — 17-seater luxury tempo for corporate travel",
  },
  {
    slug: "bus-34",
    name: "Bus 34 Seat",
    seats: "34 seats",
    tagline: "Full-size bus for school, college and staff trips.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("bus-34"),
    alt: "34 seater bus hire in Kerala — AC coach for school trips, weddings and staff transport",
  },
  {
    slug: "bus-49",
    name: "Bus 49 Seat",
    seats: "49 seats",
    tagline: "Luxury 49-seat coach for large tour groups.",
    features: ["AC", "Insured", "GPS Tracked"],
    image: img("bus-49"),
    alt: "49 seater luxury bus rental Kerala — large AC coach for group tours across Kerala and Tamil Nadu",
  },
];

export const CAB_TRIP_TYPES = [
  "One Way Trip",
  "Round Trip",
  "Airport Pickup",
  "Airport Drop",
  "Tour Package",
];

export const CAB_LANGUAGES = ["English", "Hindi", "Malayalam", "Tamil"];
