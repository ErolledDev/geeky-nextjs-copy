import config from "@config/config.json";
import Base from "@layouts/Baseof";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";
import { FaRegCalendar, FaUserAlt, FaClock, FaEye } from "react-icons/fa";
import Post from "./partials/Post";
import Sidebar from "./partials/Sidebar";
import shortcodes from "./shortcodes/all";

const { meta_author } = config.metadata;

const PostSingle = ({
  frontmatter,
  content,
  mdxContent,
  slug,
  allCategories,
  relatedPosts,
  posts,
}) => {
  let { 
    description, 
    title, 
    date, 
    image, 
    categories, 
    meta_title,
    canonical,
    noindex,
    structuredData,
    schema
  } = frontmatter;
  
  description = description ? description : content.slice(0, 160);
  const author = frontmatter.author ? frontmatter.author : meta_author;

  return (
    <Base 
      title={title} 
      meta_title={meta_title}
      description={description}
      image={image}
      canonical={canonical}
      noindex={noindex}
      structuredData={structuredData}
    >
      <section className="section single-blog mt-6">
        <div className="container">
          <div className="row">
            <div className="lg:col-8">
              <article itemScope itemType="https://schema.org/BlogPosting">
                {/* Article Header */}
                <header className="mb-8">
                  <div className="relative mb-6">
                    {image && (
                      <Image
                        src={image}
                        height="500"
                        width="1000"
                        alt={title}
                        className="rounded-lg w-full h-auto"
                        priority
                        itemProp="image"
                      />
                    )}
                    {categories && categories.length > 0 && (
                      <ul className="absolute top-3 left-2 flex flex-wrap items-center">
                        {categories.map((tag, index) => (
                          <li
                            className="mx-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white"
                            key={"tag-" + index}
                          >
                            <Link
                              className="capitalize text-xs font-medium"
                              href={`/categories/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                              itemProp="about"
                            >
                              {tag}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {markdownify(title, "h1", "lg:text-[42px] mt-4 mb-4", {
                    itemProp: "headline"
                  })}

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center">
                      <FaUserAlt className="mr-2" />
                      <span itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{author}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaRegCalendar className="mr-2" />
                      <time dateTime={date} itemProp="datePublished">
                        {dateFormat(date)}
                      </time>
                    </div>
                    {schema?.readingTime && (
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        <span>{schema.readingTime} min read</span>
                      </div>
                    )}
                    {schema?.wordCount && (
                      <div className="flex items-center">
                        <FaEye className="mr-2" />
                        <span>{schema.wordCount.toLocaleString()} words</span>
                      </div>
                    )}
                  </div>

                  {/* Article Description */}
                  {description && (
                    <div className="text-lg text-gray-700 dark:text-gray-300 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-primary">
                      <p itemProp="description">{description}</p>
                    </div>
                  )}
                </header>

                {/* Article Content */}
                <div className="content mb-16" itemProp="articleBody">
                  <MDXRemote {...mdxContent} components={shortcodes} />
                </div>

                {/* Article Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last updated: <time dateTime={schema?.dateModified || date} itemProp="dateModified">
                        {dateFormat(schema?.dateModified || date)}
                      </time>
                    </div>
                    {categories && categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                        {categories.map((category, index) => (
                          <Link
                            key={index}
                            href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                          >
                            #{category}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </footer>
              </article>
            </div>
            
            <Sidebar
              posts={posts.filter((post) => post.slug !== slug)}
              categories={allCategories}
            />
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="container mt-20">
            <h2 className="section-title">Related Posts</h2>
            <div className="row mt-16">
              {relatedPosts.slice(0, 3).map((post, index) => (
                <div key={"post-" + index} className="mb-12 lg:col-4">
                  <Post post={post} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Base>
  );
};

export default PostSingle;