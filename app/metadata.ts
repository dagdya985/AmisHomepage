import type { Metadata, Viewport } from "next";

export const siteConfig = {
  name: "Amis's Homepage",
  url: "https://www.amisweb.cn",
  ogImage: "/images/index.jpg",
  author: "Amis",
  description: {
    zh: "记录技术文章和生活感悟",
    en: "Technical articles and life insights",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: `${siteConfig.description.zh} | ${siteConfig.description.en}`,
  keywords: [
    "Amis",
    "个人主页",
    "博客",
    "技术",
    "GitHub",
    "Gitee",
    "Personal Homepage",
    "Blog",
    "Technology",
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  robots: "index, follow",
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: `${siteConfig.description.zh} | ${siteConfig.description.en}`,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: `${siteConfig.description.zh} | ${siteConfig.description.en}`,
    images: [siteConfig.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};
