import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dimensions of public/campus-map.jpg (University of Bradford roof PPM drawing,
// cropped from the Appendix 4 campus PDF). Polygon coordinates in the seed are
// expressed in this pixel space.
export const IMAGE_WIDTH = 2480;
export const IMAGE_HEIGHT = 2237;
