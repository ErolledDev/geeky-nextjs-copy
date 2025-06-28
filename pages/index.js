import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/partials/Post";
import Sidebar from "@layouts/partials/Sidebar";
import { getAllPosts, getAllCategories, getFeaturedPosts, getSiteStats } from "@lib/api";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar } from "react-icons/fa";

const { blog_folder, pagination } = config.settings;

// Default banner content
const defaultBanner = {
  title: "Welcome to **Geeky** Blog",
  title_small: "A Modern Blog Template",
  content: "Discover amazing content and insights on web development, technology, and more.",
  image_enable: true,
  image: "/images/banner-author.png",
  button: {
    enable: true,
    label: "Explore Posts",
    link: "/posts",
    rel: ""
  }
};

const defaultFeaturedPosts = {
  enable: true,
  title: "Featured Posts",
  showPost: 6
};

const defaultRecentPosts = {
  enable: true,
  title: "Recent Posts"
};

const Home = ({
  posts,
  categories,
  featuredPosts,
  siteStats
}) => {
  const showPosts = pagination;
  const banner = defaultBanner;
  const featured_posts = defaultFeaturedPosts;
  const recent_posts = defaultRecentPosts;

  // Enhanced structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": config.site.title,
    "description": config.metadata.meta_description,
    "url": config.site.base_url,
    "author": {
      "@type": "Organization",
      "name": config.metadata.meta_author
    },
    "publisher": {
      "@type": "Organization",
      "name": config.metadata.meta_author,
      "logo": {
        "@type": "ImageObject",
        "url": `${config.site.base_url}${config.site.logo}`
      }
    },
    "blogPost": posts.slice(0, 5).map(post => ({
      "@type": "BlogPosting",
      "headline": post.frontmatter.title,
      "description": post.frontmatter.description,
      "url": `${config.site.base_url}/${blog_folder}/${post.slug}`,
      "datePublished": post.frontmatter.date,
      "author": {
        "@type": "Person",
        "name": post.frontmatter.author
      }
    }))
  };

  return (
    <Base
      title="Home"
      description={config.metadata.meta_description}
      structuredData={structuredData}
    >
      {/* Banner */}
      <section className="section banner relative pb-0">
        <ImageFallback
          className="absolute bottom-0 left-0 z-[-1] w-full"
          src={"/images/banner-bg-shape.svg"}
          width={1905}
          height={295}
          alt="banner-shape"
          priority
        />

        <div className="container">
          <div className="row flex-wrap-reverse items-center justify-center lg:flex-row">
            <div className={banner.image_enable ? "mt-12 text-center lg:mt-0 lg:text-left lg:col-6" : "mt-12 text-center lg:mt-0 lg:text-left lg:col-12"}>
              <div className="banner-title">
                {markdownify(banner.title, "h1")}
                {markdownify(banner.title_small, "span")}
              </div>
              {markdownify(banner.content, "p", "mt-4")}
              
              {/* Site Stats */}
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <span className="font-semibold text-primary mr-1">{siteStats.totalPosts}</span>
                  <span>Articles</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-primary mr-1">{siteStats.totalCategories}</span>
                  <span>Categories</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-primary mr-1">{siteStats.avgReadingTime}</span>
                  <span>Avg. Read Time</span>
                </div>
              </div>

              {banner.button.enable && (
                <Link
                  className="btn btn-primary mt-6"
                  href={banner.button.link}
                  rel={banner.button.rel}
                >
                  {banner.button.label}
                </Link>
              )}
            </div>
            {banner.image_enable && (
              <div className="col-9 lg:col-6">
                <ImageFallback
                  className="mx-auto object-contain"
                  src={banner.image}
                  width={548}
                  height={443}
                  priority={true}
                  alt="Banner Image"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Home main */}
      <section className="section">
        <div className="container">
          <div className="row items-start">
            <div className="mb-12 lg:mb-0 lg:col-8">
              {/* Featured posts */}
              {featured_posts.enable && featuredPosts.length > 0 && (
                <div className="section">
                  {markdownify(featured_posts.title, "h2", "section-title")}
                  <div className="rounded border border-border p-6 dark:border-darkmode-border">
                    <div className="row">
                      <div className="md:col-6">
                        <Post post={featuredPosts[0]} />
                      </div>
                      <div className="scrollbar-w-[10px] mt-8 max-h-[480px] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-border dark:scrollbar-track-gray-800 dark:scrollbar-thumb-darkmode-theme-dark md:mt-0 md:col-6">
                        {featuredPosts
                          .slice(1, featuredPosts.length)
                          .map((post, i, arr) => (
                            <article
                              className={`mb-6 flex items-center pb-6 ${
                                i !== arr.length - 1 &&
                                "border-b border-border dark:border-darkmode-border"
                              }`}
                              key={`featured-${i}`}
                            >
                              {post.frontmatter.image && (
                                <ImageFallback
                                  className="mr-3 h-[85px] rounded object-cover"
                                  src={post.frontmatter.image}
                                  alt={post.frontmatter.title}
                                  width={105}
                                  height={85}
                                />
                              )}
                              <div>
                                <h3 className="h5 mb-2">
                                  <Link
                                    href={`/${blog_folder}/${post.slug}`}
                                    className="block hover:text-primary"
                                  >
                                    {post.frontmatter.title}
                                  </Link>
                                </h3>
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaRegCalendar className="mr-1.5" />
                                  <time dateTime={post.frontmatter.date}>
                                    {dateFormat(post.frontmatter.date)}
                                  </time>
                                  {post.frontmatter.schema?.readingTime && (
                                    <span className="ml-3">
                                      {post.frontmatter.schema.readingTime} min read
                                    </span>
                                  )}
                                </div>
                              </div>
                            </article>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {recent_posts.enable && (
                <div className="section pt-0">
                  {markdownify(recent_posts.title, "h2", "section-title")}
                  <div className="rounded border border-border px-6 pt-6 dark:border-darkmode-border">
                    <div className="row">
                      {posts.slice(0, showPosts).map((post) => (
                        <div className="mb-8 md:col-6" key={post.slug}>
                          <Post post={post} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Pagination
                totalPages={Math.ceil(posts.length / showPosts)}
                currentPage={1}
              />
            </div>
            
            {/* sidebar */}
            <Sidebar
              className={"lg:mt-[9.5rem]"}
              posts={posts}
              categories={categories}
            />
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

// Enhanced static props with better error handling and caching
export const getStaticProps = async () => {
  try {
    // Fetch data from API with parallel requests
    const [posts, categories, featuredPosts, siteStats] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getFeaturedPosts(defaultFeaturedPosts.showPost || 6),
      getSiteStats()
    ]);

    return {
      props: {
        posts: posts || [],
        categories: categories || [],
        featuredPosts: featuredPosts || [],
        siteStats: siteStats || {
          totalPosts: 0,
          totalCategories: 0,
          avgReadingTime: 0
        }
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Return fallback data in case of error
    return {
      props: {
        posts: [],
        categories: [],
        featuredPosts: [],
        siteStats: {
          totalPosts: 0,
          totalCategories: 0,
          avgReadingTime: 0
        }
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
};