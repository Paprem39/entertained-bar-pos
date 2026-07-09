import { beers } from "./beer";
import { whiskeys } from "./whiskeys";
import { mixers } from "./mixers";
import { cocktails } from "./cocktails";
import { wines } from "./wines";
import { shots } from "./shots";

export const products = [
  ...beers,
  ...whiskeys,
  ...mixers,
  ...cocktails,
  ...wines,
  ...shots,
] as const;