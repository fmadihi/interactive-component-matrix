export type Person = {
  id: string;
  name: string;
  role: string;
  email: string;
};

// export const people: Person[] = [
//   {
//     id: "1",
//     name: "Sara Ahmadi",
//     role: "Frontend Developer",
//     email: "sara@example.com",
//   },
//   {
//     id: "2",
//     name: "Ali Rezaei",
//     role: "UI Designer",
//     email: "ali@example.com",
//   },
//   {
//     id: "3",
//     name: "Nima Karimi",
//     role: "Backend Developer",
//     email: "nima@example.com",
//   },
//   {
//     id: "4",
//     name: "Maryam Hosseini",
//     role: "Product Manager",
//     email: "maryam@example.com",
//   },
//   {
//     id: "5",
//     name: "Reza Moradi",
//     role: "DevOps Engineer",
//     email: "reza@example.com",
//   },
// ];
export const people: Person[] = [
  {
    id: "p1",
    name: "Sarah Chen",
    role: "Frontend Developer",
    email: "sarah.chen@example.com",
  },
  {
    id: "p2",
    name: "Marcus Webb",
    role: "Backend Engineer",
    email: "marcus.webb@example.com",
  },
  {
    id: "p3",
    name: "Amira Patel",
    role: "Product Designer",
    email: "amira.patel@example.com",
  },
  {
    id: "p4",
    name: "Jonas Lindqvist",
    role: "DevOps Engineer",
    email: "jonas.lindqvist@example.com",
  },
  {
    id: "p5",
    name: "Priya Nair",
    role: "QA Engineer",
    email: "priya.nair@example.com",
  },
  {
    id: "p6",
    name: "Diego Alvarez",
    role: "Data Scientist",
    email: "diego.alvarez@example.com",
  },
  {
    id: "p7",
    name: "Emily Brooks",
    role: "Mobile Developer",
    email: "emily.brooks@example.com",
  },
  {
    id: "p8",
    name: "Tomas Novak",
    role: "Security Engineer",
    email: "tomas.novak@example.com",
  },
  {
    id: "p9",
    name: "Hana Sato",
    role: "UX Researcher",
    email: "hana.sato@example.com",
  },
  {
    id: "p10",
    name: "Omar Farouk",
    role: "Platform Engineer",
    email: "omar.farouk@example.com",
  },
  {
    id: "p11",
    name: "Lena Fischer",
    role: "Engineering Manager",
    email: "lena.fischer@example.com",
  },
  {
    id: "p12",
    name: "Noah Kim",
    role: "Full-Stack Developer",
    email: "noah.kim@example.com",
  },
];
export type Command = {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
};
