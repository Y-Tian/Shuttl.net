export const GOOGLE_SHEETS_DB_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdzzVMPVgDhJ06QHuf93MI8aCm7l3o9RDhTGcXILjrAwEBbDP63iWRZdOZ7773JZOqMOz3c6Xs0ksk/pub?output=csv";
export const CLOUDFLARE_R2_BASE_URL = "https://images.shuttl.net/";
export const CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL =
  "https://images.shuttl.net/cdn-cgi/image/";
export const MINI_ICON_TRANSFORM = "w=200,h=200,fit=scale-down,q=75,f=webp/"; // 50x50px, scale-down, 75% quality, WebP format
export const DEFAULT_RACKET_IMAGE_EXT = ".webp"; // Default image extension
export const DEFAULT_RACKET_IMAGE_NAME = "image_placeholder"; // Default image name
export const DEFAULT_RACKET_IMAGE = `${CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL}${MINI_ICON_TRANSFORM}${DEFAULT_RACKET_IMAGE_NAME}${DEFAULT_RACKET_IMAGE_EXT}`; // Default image URL
