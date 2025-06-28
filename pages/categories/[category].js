import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Sidebar from "@layouts/partials/Sidebar";
import { getAllCategories, getPostsByCategory, getAllPosts } from "@lib/api";
import Post from "@partials/Post";
const { blog_folder } = config.settings;

// category page
const Category = ({ postsByCategories, category, posts, categories }) => {
  return (
    <Base title={category}>
      <div className="section mt-16">
        <div className="container">
          <h1 className="h2 mb-12">
            Showing posts from
            <span className="section-title ml-1 inline-block capitalize">
              {category.replace("-", " ")}
            </span>
          </h1>
          <div className="row">
            <div className="lg:col-8">
              <div className="row rounded border border-border p-4 px-3 dark:border-darkmode-border lg:p-6">
                {postsByCategories.map((post, i) => (
                  <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                    <Post post={post} />
                  </div>
                ))}
              </div>
            </div>
            <Sidebar posts={posts} categories={categories} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

// category page routes
export const getStaticPaths = async () => {
  const allCategories = await getAllCategories();

  const paths = allCategories.map((category) => ({
    params: {
      category: category.name,
    },
  }));

  return { paths, fallback: false };
};

// category page data
export const getStaticProps = async ({ params }) => {
  const posts = await getAllPosts();
  const filterPosts = await getPostsByCategory(params.category);
  const categories = await getAllCategories();

  return {
    props: {
      posts,
      postsByCategories: filterPosts,
      category: params.category,
      categories: categories,
    },
    revalidate: 60, // Revalidate every minute
  };
};