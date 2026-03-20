interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
}

export default function SEOHead({ title, description, url }: SEOHeadProps) {
  return (
    <>
      <meta name="baidu-site-verification" content="codeva-uFVjOFk9OW" />
      <meta name="google-site-verification" content="l7PKYeoA46P9gOynxJ_7ls2joAm5ZECVy55WBCeOgU8" />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
    </>
  );
}
