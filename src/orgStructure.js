// Struktur organisasi InJourney Airports (sisi Airport Operations) yang
// dipakai sebagai pengelompokan baris di "Rekapitulasi Partisipasi per
// Departemen" — General Manager + 4 Divisi di level atas, masing-masing
// punya beberapa Department Head sebagai anak (leaf) yang benar-benar
// dipakai sebagai employees.unit_kerja / submissions.departemen di database.
export const ORG_STRUCTURE = [
  {
    key: "General Manager",
    // "General Manager" also appears as its own child here: the GM plus the
    // Project Management staff report directly to this office rather than to
    // any Department Head, so they need a department of their own that's
    // literally named after the parent group.
    children: [
      "General Manager",
      "Airport Operation Center Head",
      "Branch Communication & CSR Department Head",
      "Legal & Compliance Department Head",
      "Asset Management & General Services Department Head",
    ],
  },
  {
    key: "Airport Quality & Safety Management System",
    children: [
      "Airport Quality & Safety Management System",
      "Safety Management System & OHS Department Head",
      "Airport Quality Control Department Head",
    ],
  },
  {
    key: "Airport Operation, Services & Security",
    children: [
      "Airport Operation, Services & Security",
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
      "Airport Technical",
      "Airport Facilities Department Head",
      "Airport Equipment Department Head",
      "Airport Technology Department Head",
      "Airport Environment Department Head",
    ],
  },
  {
    key: "Airport Commercial",
    children: [
      "Airport Commercial",
      "Aero Commercial Department Head",
      "Non-Aero Commercial Department Head",
    ],
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
