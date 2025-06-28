import { getAllPosts, getAllCategories } from '@lib/api';

function generateSiteMap(posts, categories) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     
     <!-- Posts page -->
     <url>
       <loc>${baseUrl}/posts</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     
     <!-- Categories page -->
     <url>
       <loc>${baseUrl}/categories</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <!-- Individual posts -->
     ${posts
       .map((post) => {
         return `
       <url>
           <loc>${baseUrl}/posts/${post.slug}</loc>
           <lastmod>${new Date(post.frontmatter.schema?.dateModified || post.frontmatter.date).toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join('')}
     
     <!-- Category pages -->
     ${categories
       .map((category) => {
         return `
       <url>
           <loc>${baseUrl}/categories/${category.name}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.5</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch all posts and categories
    const [posts, categories] = await Promise.all([
      getAllPosts(),
      getAllCategories()
    ]);

    // Generate the XML sitemap
    const sitemap = generateSiteMap(posts, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    
    return {
      props: {},
    };
  }
}

export default SiteMap;