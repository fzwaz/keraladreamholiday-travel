export const SITE = {
  name: "Dreams Kerala Holiday",
  shortName: "Dreams Kerala",
  tagline: "Kerala, at walking pace.",
  description:
    "Dreams Kerala Holiday plans slow, small-group Kerala tour packages — Munnar tea hills, Alleppey houseboats, Thekkady wildlife, Wayanad and Kovalam — with a local guide, not a checklist.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamskeralaholiday.com",
  locale: "en_IN",
  phone: "+91 484 234 5678",
  phoneHref: "tel:+914842345678",
  whatsapp: "https://wa.me/914842345678",
  email: "hello@dreamskeralaholiday.com",
  address: "Kochi, Kerala, India",
} as const;

export type Region = {
  place: string;
  name: string;
  blurb: string;
};

export const REGIONS: Region[] = [
  {
    place: "Idukki",
    name: "Munnar",
    blurb:
      "Tea terraces folding over the Western Ghats, misty from June to September, sharp and green the rest of the year.",
  },
  {
    place: "Alappuzha",
    name: "Backwaters",
    blurb:
      "A slow drift through Kuttanad's canals on a converted rice barge, past coconut groves and paddy fields below sea level.",
  },
  {
    place: "Wayanad",
    name: "Wayanad",
    blurb:
      "Cooler, wilder hill country — spice plantations, cave temples, and forest edges where elephants still cross the road.",
  },
  {
    place: "Idukki",
    name: "Thekkady",
    blurb:
      "Periyar's forest edge, cardamom hills and boat rides where the wildlife watches you as much as you watch it.",
  },
  {
    place: "Kottayam",
    name: "Kumarakom",
    blurb:
      "A quieter shore of Vembanad Lake — heron colonies, houseboats moored for the night, and very little to schedule.",
  },
  {
    place: "Thiruvananthapuram",
    name: "Kovalam",
    blurb:
      "Where the Ghats meet the coast — red cliffs, lighthouse views, and the trip's last, unhurried few days.",
  },
];

export type TourPackage = {
  slug: string;
  place: string;
  title: string;
  duration: string;
  was: string;
  now: string;
  off: string;
  tags: string[];
  palette: [string, string, string];
  motif: "hills" | "water" | "coast" | "sun";
  group: string;
};

export const PACKAGE_GROUPS: { value: string; label: string; chip: string }[] = [
  { value: "kerala", label: "Kerala", chip: "Kerala" },
  { value: "munnar", label: "Munnar", chip: "Munnar Tour Packages" },
  { value: "alleppey", label: "Alleppey", chip: "Alleppey Tour Packages" },
  { value: "thekkady", label: "Thekkady", chip: "Thekkady Tour Packages" },
  { value: "wayanad", label: "Wayanad", chip: "Wayanad Tour Packages" },
  { value: "kovalam", label: "Kovalam", chip: "Kovalam Tour Packages" },
  { value: "honeymoon", label: "Honeymoon", chip: "Kerala Honeymoon Packages" },
  { value: "group", label: "Group", chip: "Group Packages" },
  { value: "school-college", label: "School & College", chip: "School & College Packages" },
];

export function groupLabel(value: string | undefined): string {
  return PACKAGE_GROUPS.find((g) => g.value === value)?.label ?? "Kerala";
}

export const PACKAGES: TourPackage[] = [
  {
    slug: "munnar-tea-trail",
    group: "munnar",
    place: "Munnar",
    title: "Munnar Tea Trail — 4 Nights / 5 Days",
    duration: "5D / 4N",
    was: "₹21,999",
    now: "₹17,599",
    off: "12% OFF",
    tags: ["Hotel", "No Flights", "Tour Guide"],
    palette: ["#DCE6D2", "#9FB58C", "#4C6B4F"],
    motif: "hills",
  },
  {
    slug: "alleppey-backwater-escape",
    group: "alleppey",
    place: "Alleppey",
    title: "Alleppey Backwater Escape — 3 Nights / 4 Days",
    duration: "3D / 4N",
    was: "₹16,500",
    now: "₹13,050",
    off: "10% OFF",
    tags: ["Houseboat", "No Flights", "Tour Guide"],
    palette: ["#CFE0DE", "#7FA3A0", "#345048"],
    motif: "water",
  },
  {
    slug: "thekkady-wildlife-spice-trail",
    group: "thekkady",
    place: "Thekkady",
    title: "Thekkady Wildlife & Spice Trail — 5 Nights / 6 Days",
    duration: "5D / 6N",
    was: "₹23,000",
    now: "₹19,199",
    off: "14% OFF",
    tags: ["Hotel", "No Flights", "Tour Guide"],
    palette: ["#E3E9D6", "#8FA678", "#5B7A52"],
    motif: "hills",
  },
  {
    slug: "wayanad-hill-retreat",
    group: "wayanad",
    place: "Wayanad",
    title: "Wayanad Hill Retreat — 4 Nights / 5 Days",
    duration: "4D / 5N",
    was: "₹18,999",
    now: "₹15,199",
    off: "20% OFF",
    tags: ["Hotel", "No Flights", "Tour Guide"],
    palette: ["#D7E2CB", "#7FA06B", "#4C6B4F"],
    motif: "hills",
  },
  {
    slug: "kumarakom-lake-escape",
    group: "kerala",
    place: "Kumarakom",
    title: "Kumarakom Lake Escape — 3 Nights / 4 Days",
    duration: "3D / 4N",
    was: "₹17,800",
    now: "₹14,520",
    off: "18% OFF",
    tags: ["Houseboat", "No Flights", "Tour Guide"],
    palette: ["#CFE0DE", "#5B8072", "#2F4A34"],
    motif: "water",
  },
  {
    slug: "kovalam-coastal-getaway",
    group: "kovalam",
    place: "Kovalam",
    title: "Kovalam Coastal Getaway — 4 Nights / 5 Days",
    duration: "4D / 5N",
    was: "₹19,999",
    now: "₹16,449",
    off: "15% OFF",
    tags: ["Hotel", "No Flights", "Tour Guide"],
    palette: ["#E7E1CE", "#C7B383", "#8C7A4C"],
    motif: "coast",
  },
  {
    slug: "grand-kerala-circuit",
    group: "kerala",
    place: "Munnar · Thekkady · Alleppey",
    title: "Grand Kerala Circuit — 6 Nights / 7 Days",
    duration: "6D / 7N",
    was: "₹29,500",
    now: "₹24,999",
    off: "15% OFF",
    tags: ["Hotel", "Houseboat", "Tour Guide"],
    palette: ["#DCE6D2", "#5B7A52", "#33502F"],
    motif: "hills",
  },
  {
    slug: "wayanad-honeymoon",
    group: "honeymoon",
    place: "Wayanad",
    title: "Wayanad Honeymoon Package — 3 Nights / 4 Days",
    duration: "3D / 4N",
    was: "₹20,500",
    now: "₹16,999",
    off: "17% OFF",
    tags: ["Hotel", "No Flights", "Candlelight Dinner"],
    palette: ["#E3E9D6", "#8FA678", "#33502F"],
    motif: "sun",
  },
  {
    slug: "kochi-kovalam-coastal-trail",
    group: "kerala",
    place: "Kochi · Kovalam",
    title: "Kochi to Kovalam Coastal Trail — 4 Nights / 5 Days",
    duration: "4D / 5N",
    was: "₹16,000",
    now: "₹13,499",
    off: "16% OFF",
    tags: ["Hotel", "No Flights", "Tour Guide"],
    palette: ["#CFE0DE", "#4C6B4F", "#2F4A34"],
    motif: "coast",
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What's the best time of year to visit Kerala?",
    a: "October to March is the classic window — cooler, drier, and best for both the backwaters and the hill country. June to September brings the monsoon, which some travellers specifically seek out for Munnar and Wayanad's waterfalls and misty tea slopes, though houseboat routes can be affected by high water levels.",
  },
  {
    q: "How many days do we actually need for Kerala?",
    a: "Five to seven days covers two or three regions comfortably — say, Munnar and Alleppey, or Thekkady and Kumarakom — without feeling rushed. Ten days or more lets you add the coast at Kovalam. We'd rather build a shorter trip with fewer transfers than a packed one that spends half its time on the road.",
  },
  {
    q: "Do you arrange houseboat and backwater stays?",
    a: "Yes — houseboat nights in Alleppey and Kumarakom are part of most itineraries. We work with a small set of operators we've stayed with ourselves, so we can tell you honestly which boats are worth the extra rupees and which aren't.",
  },
  {
    q: "Is Kerala safe for families, couples and solo travellers?",
    a: "Kerala is generally one of India's easier states to travel in, with good roads, high literacy, and a strong tourism infrastructure. We adjust the pace and stops depending on who's travelling — slower and shorter drives for families with young children, more offbeat trails for solo travellers who want fewer crowds.",
  },
  {
    q: "What's included in a package price?",
    a: "Every quote spells out exactly what's covered — typically hotel or houseboat stays, a private vehicle with driver, and a local guide for key stops. Flights and personal expenses are usually separate, and we'll flag that clearly before you book anything, not after.",
  },
  {
    q: "Can you customise an itinerary instead of a fixed package?",
    a: "That's how we prefer to work, actually. Tell us your dates and the shape of the trip you want, and we'll draft a route around it — swap a region, add a slow day, or drop a stop that sounds more like a duty than something you actually want to see.",
  },
  {
    q: "Do we need permits for Periyar or other wildlife reserves?",
    a: "Boat rides and treks inside Periyar Tiger Reserve at Thekkady need entry tickets and, for some activities, advance booking through the forest department. If your itinerary includes Thekkady, we handle this booking as part of the plan so you're not queuing at the counter on the day.",
  },
  {
    q: "How does payment and cancellation work?",
    a: "We usually ask for a partial advance to confirm hotel and houseboat bookings, with the balance due closer to your travel date. Cancellation terms vary by property and season, and we'll always show you the specific policy for your itinerary before you pay anything.",
  },
];

export const TRAVELLERS_ROW_1 = [
  { name: "Priya & Dev", caption: "Kumarakom" },
  { name: "Fatima Rahman", caption: "Alleppey Backwaters" },
  { name: "The Nair Family", caption: "Thekkady" },
  { name: "Aravind K.", caption: "Wayanad" },
  { name: "Meera & Kiran", caption: "Munnar Tea Trail" },
  { name: "Rohan Verma", caption: "Kovalam Coast" },
];

export const TRAVELLERS_ROW_2 = [
  { name: "Sana & Vivek", caption: "Munnar" },
  { name: "The Josephs", caption: "Grand Kerala Circuit" },
  { name: "Lakshmi S.", caption: "Alleppey Houseboat" },
  { name: "Farah & Omar", caption: "Wayanad Honeymoon" },
  { name: "Anoop Menon", caption: "Kochi to Kovalam" },
  { name: "Divya & Sam", caption: "Kumarakom Lake" },
];
