import { Compass, House, ChartNoAxesColumn, Radio } from "lucide-react";

/**
 * Primary navigation items, shared by the navbar and the footer.
 *
 * /mission/:id is intentionally not listed: a mission story needs an id, so
 * it is reached from the Explorer rather than from the main menu.
 */
export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/explorer", label: "Explorer", icon: Compass },
  { to: "/voyager", label: "Voyager", icon: Radio },
  { to: "/intelligence", label: "Intelligence", icon: ChartNoAxesColumn },
];
