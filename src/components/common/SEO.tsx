import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    twitterCard?: 'summary' | 'summary_large_image';
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonicalUrl,
    ogImage = '/dave.webp',
    ogType = 'website',
    twitterCard = 'summary_large_image',
}) => {
    const siteUrl = 'https://www.freedommergers.com';
    const fullCanonicalUrl = canonicalUrl
        ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`)
        : siteUrl;

    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:site_name" content="Dave Marshall - Freedom Mergers" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullOgImage} />

            {/* Schema.org JSON-LD support can be added here in future */}
        </Helmet>
    );
};

export default SEO;
