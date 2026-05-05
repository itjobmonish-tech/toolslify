import {
  SITE_NAME,
  SOCIAL_IMAGE,
  TWITTER_IMAGE_PATH,
} from "./site-data.js";

export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function buildPageMetadata({
  title,
  description,
  canonical,
  url = canonical,
  type = "website",
  twitterTitle = title,
  twitterDescription = description,
  robots,
  keywords,
}) {
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    ...(keywords?.length ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [TWITTER_IMAGE_PATH],
    },
  };
}
