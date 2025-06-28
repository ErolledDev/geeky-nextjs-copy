import NotFound from "@layouts/404";
import About from "@layouts/About";
import Base from "@layouts/Baseof";
import Contact from "@layouts/Contact";
import Default from "@layouts/Default";

// Default content for static pages
const getDefaultPageContent = (slug) => {
  const defaultPages = {
    about: {
      frontmatter: {
        title: "About Us",
        layout: "about",
        image: "/images/author.png",
        education: {
          title: "Education",
          degrees: [
            {
              university: "University of Technology",
              content: "Bachelor of Computer Science"
            },
            {
              university: "Tech Institute", 
              content: "Master of Web Development"
            }
          ]
        },
        experience: {
          title: "Experience",
          list: [
            "Frontend Development",
            "Backend Development", 
            "UI/UX Design",
            "Project Management"
          ]
        }
      },
      content: "We are passionate developers creating amazing web experiences. Our team specializes in modern web technologies and loves sharing knowledge through our blog.",
      mdxContent: null
    },
    contact: {
      frontmatter: {
        title: "Contact Us",
        layout: "contact",
        form_action: "#",
        phone: "+1 (555) 123-4567",
        mail: "contact@example.com",
        location: "123 Tech Street, Digital City"
      },
      content: "Get in touch with us! We'd love to hear from you.",
      mdxContent: null
    },
    elements: {
      frontmatter: {
        title: "Elements"
      },
      content: "# Typography\n\n## Headings\n\n# Heading 1\n## Heading 2\n### Heading 3\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
      mdxContent: null
    },
    "404": {
      frontmatter: {
        title: "Page Not Found",
        layout: "404"
      },
      content: "Sorry, the page you are looking for doesn't exist. Please check the URL or navigate back to the homepage.",
      mdxContent: null
    }
  };

  return defaultPages[slug] || defaultPages["404"];
};

// for all regular pages
const RegularPages = ({ data }) => {
  const { title, meta_title, description, image, noindex, canonical, layout } =
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
      {layout === "404" ? (
        <NotFound data={data} />
      ) : layout === "about" ? (
        <About data={data} />
      ) : layout === "contact" ? (
        <Contact data={data} />
      ) : (
        <Default data={data} />
      )}
    </Base>
  );
};
export default RegularPages;

// for regular page routes
export const getStaticPaths = async () => {
  const paths = [
    { params: { regular: "about" } },
    { params: { regular: "contact" } },
    { params: { regular: "elements" } }
  ];

  return {
    paths,
    fallback: false,
  };
};

// for regular page data
export const getStaticProps = async ({ params }) => {
  const { regular } = params;
  const data = getDefaultPageContent(regular);
  
  return {
    props: {
      slug: regular,
      data: data,
    },
  };
};