import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getAllPostSlugs, getPostBySlug, getAllCategories, getRelatedPosts, getAllPosts } from "@lib/api";
import parseMDX from "@lib/utils/mdxParser";

// post single layout
const Article = ({
  post,
  mdxContent,
  slug,
  allCategories,
  relatedPosts,
  posts,
}) => {
  const { frontmatter, content } = post;

  return (
    <PostSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      slug={slug}
      allCategories={allCategories}
      relatedPosts={relatedPosts}
      posts={posts}
    />
  );
};

// get post single slug
export const getStaticPaths = async () => {
  const allSlugs = await getAllPostSlugs();
  const paths = allSlugs.map((slug) => ({
    params: {
      single: slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const post = await getPostBySlug(single);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxContent = await parseMDX(post.content);
  const relatedPosts = await getRelatedPosts(post, 3);
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return {
    props: {
      post: post,
      mdxContent: mdxContent,
      slug: single,
      allCategories: categories,
      relatedPosts: relatedPosts,
      posts: posts,
    },
    revalidate: 60, // Revalidate every minute
  };
};

export default Article;