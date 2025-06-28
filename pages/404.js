import NotFound from "@layouts/404";
import Base from "@layouts/Baseof";

const notFound = ({ data }) => {
  return (
    <Base>
      <NotFound data={data} />
    </Base>
  );
};

// get 404 page data
export const getStaticProps = async () => {
  const notFoundData = {
    frontmatter: {
      title: "Page Not Found",
      layout: "404"
    },
    content: "Sorry, the page you are looking for doesn't exist. Please check the URL or navigate back to the homepage."
  };
  
  return {
    props: {
      data: notFoundData,
    },
  };
};

export default notFound;