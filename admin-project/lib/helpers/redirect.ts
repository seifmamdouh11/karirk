export const getMainSiteUrl = (path: string): string => {
  // If we are in the browser and running locally on port 3001, point to localhost:3000
  if (typeof window !== "undefined" && window.location.origin.includes("localhost:3001")) {
    return `http://localhost:3000${path}`;
  }
  
  // By default (including SSR), return the production main site URL.
  // This ensures that <Link> components treat it as an external absolute URL from the first render.
  return `https://karirk.vercel.app${path}`;
};
