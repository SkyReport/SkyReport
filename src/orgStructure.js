// Struktur organisasi InJourney Airports (sisi Airport Operations) yang
// dipakai sebagai pengelompokan baris di "Rekapitulasi Partisipasi per
// Departemen" — General Manager + 4 Divisi di level atas, masing-masing
// punya beberapa Department Head sebagai anak (leaf) yang benar-benar
// dipakai sebagai employees.unit_kerja / submissions.departemen di database.
export const ORG_STRUCTURE = [
  {
    key: "General Manager",
    // Everything that doesn't cleanly belong to one of the 4 divisions below
    // is bucketed here as its own Department-Head-equivalent leaf: the GM
    // office itself, each division's "Division Head" role (moved out of its
    // own division so a division isn't listed as a child of itself), and
    // units not yet broken out into a proper Department Head (Finance
    // Section, Airport Aeronautical, Support Services/PJP2U/HC Solution).
    children: [
      "General Manager",
      "Airport Operation Center Head",
      "Branch Communication & CSR Department Head",
      "Legal & Compliance Department Head",
      "Asset Management & General Services Department Head",
      "Airport Operation, Services & Security Division Head",
      "Airport Technical Division Head",
      "Airport Commercial Division Head",
      "Airport Quality & Safety Management System Division Head",
      "Finance Section",
      "Airport Aeronautical",
      "Support Services",
    ],
  },
  {
    key: "Airport Quality & Safety Management System",
    children: [
      "Safety Management System & OHS Department Head",
      "Airport Quality Control Department Head",
    ],
  },
  {
    key: "Airport Operation, Services & Security",
    children: [
      "Airport Operation Airside Department Head",
      "Airport Operation Landside & Terminal Department Head",
      "Airport Services Improvement Department Head",
      "Airport Rescue & Fire Fighting Department Head",
      "Airport Security Protection Department Head",
      "Airport Security Screening Department Head",
    ],
  },
  {
    key: "Airport Technical",
    children: [
      "Airport Facilities Department Head",
      "Airport Equipment Department Head",
      "Airport Technology Department Head",
      "Airport Environment Department Head",
    ],
  },
  {
    key: "Airport Commercial",
    children: ["Aero Commercial Department Head", "Non-Aero Commercial Department Head"],
  },
];

export const ORG_PARENT_KEYS = ORG_STRUCTURE.map((group) => group.key);

export const ORG_CHILDREN_BY_PARENT = new Map(
  ORG_STRUCTURE.map((group) => [group.key, group.children])
);

const LEAF_TO_PARENT = new Map(
  ORG_STRUCTURE.flatMap((group) => group.children.map((child) => [child, group.key]))
);

export function parentOf(leafDepartment) {
  return LEAF_TO_PARENT.get(leafDepartment) ?? leafDepartment;
}
