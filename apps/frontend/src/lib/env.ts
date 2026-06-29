export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
};

if (!env.API_URL) {
  throw new Error("Missing env variable: NEXT_PUBLIC_API_URL");
}