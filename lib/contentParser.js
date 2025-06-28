import fs from "fs";
import path from "path";
import matter from "gray-matter";
import parseMDX from "./utils/mdxParser";

const contentDirectory = path.join(process.cwd(), "content");

export async function getListPage(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);
  const mdxContent = await parseMDX(content);
  return {
    frontmatter,
    content,
    mdxContent,
  };
}

export async function getRegularPage(slug) {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);
  const mdxContent = await parseMDX(content);
  return {
    frontmatter,
    content,
    mdxContent,
  };
}

export function getSinglePage(folderName) {
  const folderPath = path.join(process.cwd(), folderName);
  const files = fs.readdirSync(folderPath);

  const slugs = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const fileName = file.replace(/\.mdx?$/, "");
      if (fileName === "_index") {
        return null;
      }
      return { slug: fileName };
    })
    .filter(Boolean);

  return slugs;
}