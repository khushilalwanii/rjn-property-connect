export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  identity: string;
  verified: boolean;
  description: string;
};

// In-memory property list (acts like DB)
export const properties: Property[] = [
  {
    id: "R001",
    title: "2 BHK Independent House",
    price: 978675,
    location: "Rajnandgaon",
    identity: "Owner",
    verified: true,
    description:
      "Well-maintained house in a peaceful residential area.",
  },
  {
    id: "R002",
    title: "Commercial Plot",
    price: 4599090,
    location: "Rajnandgaon",
    identity: "Broker",
    verified: false,
    description:
      "Prime commercial land suitable for business use.",
  },
];

// Helper to add new property
export function addProperty(property: Property) {
  properties.unshift(property); // add on top
}
