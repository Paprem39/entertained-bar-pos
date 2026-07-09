import { CATEGORY } from "../constants";
import type { SeedProduct } from "../types";

export const wines: readonly SeedProduct[] = [
  {
    category: CATEGORY.WINE,
    name: "Red Wine Glass",
    normalPrice: 150,
    tournamentPrice: null,
    allowMixer: false,
  },
  {
    category: CATEGORY.WINE,
    name: "White Wine Glass",
    normalPrice: 150,
    tournamentPrice: null,
    allowMixer: false,
  },
  {
    category: CATEGORY.WINE,
    name: "Champagne",
    normalPrice: 1800,
    tournamentPrice: null,
    allowMixer: false,
  },
  {
    category: CATEGORY.WINE,
    name: "Red Wine Bottle",
    normalPrice: 1300,
    tournamentPrice: null,
    allowMixer: false,
  },
  {
    category: CATEGORY.WINE,
    name: "White Wine Bottle",
    normalPrice: 1300,
    tournamentPrice: null,
    allowMixer: false,
  },
];