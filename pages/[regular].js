import NotFound from "@layouts/404";
import Base from "@layouts/Baseof";

// for all regular pages - simplified to just show 404
const RegularPages = ({ data }) => {
  const { title, meta_title, description, image, noindex, canonical } =
    data.frontmatter;
  const { content } = data;

  return (
    <Base
      title={title}
      description={description ? description : content.slice(0, 120)}
      meta_title={meta_title}
      image={image}
      noindex={noindex}
      canonical={canonical}
    >
      <NotFound data={data} />
    </Base>
  );
};
export default RegularPages;

// for regular page routes - only handle 404
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

// for regular page data
export const getStaticProps = async ({ params }) => {
  const { regular } = params;
  
  // Return 404 for any regular page
  const data = {
    frontmatter: {
      title: "Page Not Found",
      layout: "404"
    },
    content: "Sorry, the page you are looking for doesn't exist. Please check the URL or navigate back to the homepage."
  };
  
  return {
    props: {
      slug: regular,
      data: data,
    },
  };
};