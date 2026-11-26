import { absoluteUrl, canonicalUrl } from "@/utils/siteUrl";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";

export { absoluteUrl, canonicalUrl };

export function buildMetadataFromSeo({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  authors,
  publishedTime,
  modifiedTime,
}) {
  const canonical = canonicalUrl(path);
  const images = image?.finalUri
    ? [
        {
          url: image.finalUri,
          width: image.width || 1200,
          height: image.height || 630,
          alt: image.alt || title,
        },
      ]
    : [DEFAULT_OG_IMAGE];
  const metadata = {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      images,
      publishedTime,
      modifiedTime,
      authors,
    },
    alternates: {
      canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
  };

  if (authors?.length) {
    metadata.authors = authors.map((name) =>
      typeof name === "string" ? { name } : name
    );
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
    };
  }

  return metadata;
}
