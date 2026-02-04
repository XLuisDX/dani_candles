import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://danicandles.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/order/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
