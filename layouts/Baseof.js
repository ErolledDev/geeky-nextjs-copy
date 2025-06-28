import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Footer from "@partials/Footer";
import Header from "@partials/Header";
import Head from "next/head";
import { useRouter } from "next/router";

const Base = ({
  title,
  meta_title,
  description,
  image,
  noindex,
  canonical,
  structuredData,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url, title: siteTitle } = config.site;
  const router = useRouter();

  // Enhanced SEO title generation
  const pageTitle = plainify(
    meta_title ? meta_title : title ? `${title} | ${siteTitle}` : siteTitle
  );

  // Enhanced description
  const pageDescription = plainify(
    description ? description : meta_description
  );

  // Canonical URL
  const canonicalUrl = canonical || `${base_url}${router.asPath}`;

  // Open Graph image
  const ogImage = image ? `${base_url}${image}` : `${base_url}${meta_image}`;

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="author" content={meta_author} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} itemProp="url" />

        {/* Robots Meta */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}
        {!noindex && <meta name="robots" content="index,follow" />}

        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={title || siteTitle} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={title || siteTitle} />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#2ba283" />
        <meta name="msapplication-TileColor" content="#2ba283" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}

        {/* Favicon and App Icons */}
        <link rel="icon" href="/images/favicon.png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Base;