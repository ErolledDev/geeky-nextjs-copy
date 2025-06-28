import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Pagination from "@layouts/components/Pagination";
import { getAllPosts } from "@lib/api";
import { markdownify } from "@lib/utils/textConverter";
import { sortByDate } from "@lib/utils/sortFunctions";
import Post from "@partials/Post";
const { pagination } = config.settings;

// blog pagination
const BlogPagination = ({ posts, currentPage, paginationCount }) => {
  const indexOfLastPost = currentPage * paginationCount;
  const indexOfFirstPost = indexOfLastPost - paginationCount;
  const orderedPosts = sortByDate(posts);
  const currentPosts = orderedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const title = "Blog Posts";
  const totalPages = Math.ceil(posts.length / paginationCount);

  return (
    <Base title={title}>
      <section className="section">
        <div className="container">
          {markdownify(title, "h1", "h2 mb-8 text-center")}
          <div className="row mb-16">
            {currentPosts.map((post, i) => (
              <div className="mt-16 lg:col-6" key={post.slug}>
                <Post post={post} />
              </div>
            ))}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </section>
    </Base>
  );
};

export default BlogPagination;

// get blog pagination slug
export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allPosts.length / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

// get blog pagination content
export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { pagination } = config.settings;
  const posts = await getAllPosts();

  return {
    props: {
      paginationCount: pagination,
      posts: posts,
      currentPage: currentPage,
    },
    revalidate: 60, // Revalidate every minute
  };
};