// API utility functions for fetching content from external endpoint

const API_BASE_URL = process.env.API_BASE_URL || 'https://blogform.netlify.app/api/content.json';

/**
 * Fetch all published content from the API
 * @returns {Promise<Array>} Array of content objects
 */
export async function fetchAllContent() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Filter only published content and sort by publishDate (newest first)
    return data
      .filter(item => item.status === 'published')
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}

/**
 * Get all posts formatted for the application
 * @returns {Promise<Array>} Array of formatted post objects
 */
export async function getAllPosts() {
  const content = await fetchAllContent();
  
  return content.map(item => ({
    slug: item.slug,
    frontmatter: {
      title: item.title,
      date: item.publishDate,
      image: item.featuredImageUrl,
      categories: item.categories || [],
      tags: item.tags || [],
      author: item.author,
      description: item.metaDescription,
      featured: false, // API doesn't have featured flag, we'll use latest posts
      draft: false
    },
    content: item.content || ''
  }));
}

/**
 * Get a single post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object|null>} Post object or null if not found
 */
export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get all unique categories with post counts
 * @returns {Promise<Array>} Array of category objects with name and post count
 */
export async function getAllCategories() {
  const posts = await getAllPosts();
  const categoryMap = new Map();
  
  posts.forEach(post => {
    post.frontmatter.categories.forEach(category => {
      const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
      if (categoryMap.has(normalizedCategory)) {
        categoryMap.set(normalizedCategory, categoryMap.get(normalizedCategory) + 1);
      } else {
        categoryMap.set(normalizedCategory, 1);
      }
    });
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    posts: count
  }));
}

/**
 * Get posts by category
 * @param {string} categorySlug - The category slug
 * @returns {Promise<Array>} Array of posts in the category
 */
export async function getPostsByCategory(categorySlug) {
  const posts = await getAllPosts();
  
  return posts.filter(post => 
    post.frontmatter.categories.some(category => 
      category.toLowerCase().replace(/\s+/g, '-') === categorySlug
    )
  );
}

/**
 * Get all post slugs for static generation
 * @returns {Promise<Array>} Array of post slugs
 */
export async function getAllPostSlugs() {
  const posts = await getAllPosts();
  return posts.map(post => post.slug);
}

/**
 * Get related posts based on categories
 * @param {Object} currentPost - The current post object
 * @param {number} limit - Maximum number of related posts to return
 * @returns {Promise<Array>} Array of related posts
 */
export async function getRelatedPosts(currentPost, limit = 3) {
  const allPosts = await getAllPosts();
  const currentCategories = currentPost.frontmatter.categories;
  
  const relatedPosts = allPosts.filter(post => {
    if (post.slug === currentPost.slug) return false;
    
    return post.frontmatter.categories.some(category => 
      currentCategories.includes(category)
    );
  });
  
  return relatedPosts.slice(0, limit);
}

/**
 * Get featured posts (latest posts for now since API doesn't have featured flag)
 * @param {number} limit - Number of featured posts to return
 * @returns {Promise<Array>} Array of featured posts
 */
export async function getFeaturedPosts(limit = 6) {
  const posts = await getAllPosts();
  return posts.slice(0, limit).map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      featured: true
    }
  }));
}