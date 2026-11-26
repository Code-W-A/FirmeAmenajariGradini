import { createClient } from "next-sanity";
import {
  configuredSanityProjectId,
  hasSanityConfig,
  sanityApiVersion,
  sanityDataset,
} from "./env";

export const sanityClient = createClient({
  projectId: configuredSanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});

export async function sanityFetch({
  query,
  params = {},
  fallback = null,
  revalidate = 60,
  tags = [],
  strict = false,
}) {
  if (!hasSanityConfig) return fallback;

  try {
    return await sanityClient.fetch(query, params, {
      next: {
        revalidate,
        tags,
      },
    });
  } catch (error) {
    if (strict) throw error;
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}

