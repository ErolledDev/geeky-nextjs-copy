// Enhanced API utility functions for fetching content from external endpoint

const API_BASE_URL = process.env.API_BASE_URL || 'https://blogform.netlify.app/api/content.json';

// Cache for API responses
let contentCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all published content from the API with caching
 * @returns {Promise<Array>} Array of content objects
 */
export async function fetchAllContent() {
  try {
    // Check if we have valid cached data
    if (contentCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return contentCache;
    }

    const response = await fetch(API_BASE_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter only published content and sort by publishDate (newest first)
    const filteredData = data
      .filter(item => item.status === 'published')
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    // Update cache
    contentCache = filteredData;
    cacheTimestamp = Date.now();
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching content:', error);
    // Return cached data if available, otherwise empty array
    return contentCache || [];
  }
}

/**
 * Get all posts formatted for the application with enhanced SEO data
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
      author: item.author || 'Admin',
      description: item.metaDescription || item.excerpt || '',
      featured: item.featured || false,
      draft: false,
      // Enhanced SEO fields
      meta_title: item.metaTitle || item.title,
      canonical: item.canonicalUrl || '',
      noindex: item.noindex || false,
      schema: {
        type: 'BlogPosting',
        datePublished: item.publishDate,
        dateModified: item.updatedAt || item.publishDate,
        wordCount: item.wordCount || 0,
        readingTime: item.readingTime || Math.ceil((item.content?.length || 0) / 1000)
      }
    },
    content: item.content || '',
    excerpt: item.excerpt || ''
  }));
}

/**
 * Get a single post by slug with enhanced data
 * @param {string} slug - The post slug
 * @returns {Promise<Object|null>} Post object or null if not found
 */
export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  const post = posts.find(post => post.slug === slug);
  
  if (!post) return null;
  
  // Add additional SEO and content data
  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      // Generate structured data
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.frontmatter.title,
        "description": post.frontmatter.description,
        "image": post.frontmatter.image,
        "author": {
          "@type": "Person",
          "name": post.frontmatter.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Geeky Blog"
        },
        "datePublished": post.frontmatter.date,
        "dateModified": post.frontmatter.schema.dateModified,
        "wordCount": post.frontmatter.schema.wordCount,
        "timeRequired": `PT${post.frontmatter.schema.readingTime}M`
      }
    }
  };
}

/**
 * Get all unique categories with post counts and SEO data
 * @returns {Promise<Array>} Array of category objects with name, post count, and SEO data
 */
export async function getAllCategories() {
  const posts = await getAllPosts();
  const categoryMap = new Map();
  
  posts.forEach(post => {
    post.frontmatter.categories.forEach(category => {
      const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
      const categoryData = categoryMap.get(normalizedCategory) || {
        name: normalizedCategory,
        displayName: category,
        posts: 0,
        description: `Explore articles about ${category}`,
        latestPost: null
      };
      
      categoryData.posts += 1;
      
      // Track latest post for each category
      if (!categoryData.latestPost || new Date(post.frontmatter.date) > new Date(categoryData.latestPost.date)) {
        categoryData.latestPost = {
          title: post.frontmatter.title,
          date: post.frontmatter.date,
          slug: post.slug
        };
      }
      
      categoryMap.set(normalizedCategory, categoryData);
    });
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => b.posts - a.posts);
}

/**
 * Get posts by category with pagination support
 * @param {string} categorySlug - The category slug
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Posts per page
 * @returns {Promise<Object>} Object with posts, pagination info, and category data
 */
export async function getPostsByCategory(categorySlug, page = 1, limit = 10) {
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();
  
  const categoryData = categories.find(cat => cat.name === categorySlug);
  
  const filteredPosts = allPosts.filter(post => 
    post.frontmatter.categories.some(category => 
      category.toLowerCase().replace(/\s+/g, '-') === categorySlug
    )
  );
  
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    category: categoryData,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
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
 * Get related posts based on categories and tags
 * @param {Object} currentPost - The current post object
 * @param {number} limit - Maximum number of related posts to return
 * @returns {Promise<Array>} Array of related posts
 */
export async function getRelatedPosts(currentPost, limit = 3) {
  const allPosts = await getAllPosts();
  const currentCategories = currentPost.frontmatter.categories;
  const currentTags = currentPost.frontmatter.tags || [];
  
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      
      // Score based on shared categories (higher weight)
      const sharedCategories = post.frontmatter.categories.filter(cat => 
        currentCategories.includes(cat)
      );
      score += sharedCategories.length * 3;
      
      // Score based on shared tags (lower weight)
      const sharedTags = (post.frontmatter.tags || []).filter(tag => 
        currentTags.includes(tag)
      );
      score += sharedTags.length * 1;
      
      return { ...post, relevanceScore: score };
    })
    .filter(post => post.relevanceScore > 0)
    .sort((a, b) => {
      // Sort by relevance score first, then by date
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
    });
  
  return scoredPosts.slice(0, limit);
}

/**
 * Get featured posts with better selection logic
 * @param {number} limit - Number of featured posts to return
 * @returns {Promise<Array>} Array of featured posts
 */
export async function getFeaturedPosts(limit = 6) {
  const posts = await getAllPosts();
  
  // First try to get posts marked as featured
  const explicitlyFeatured = posts.filter(post => post.frontmatter.featured);
  
  if (explicitlyFeatured.length >= limit) {
    return explicitlyFeatured.slice(0, limit);
  }
  
  // If not enough featured posts, supplement with latest posts
  const remaining = limit - explicitlyFeatured.length;
  const latestPosts = posts
    .filter(post => !post.frontmatter.featured)
    .slice(0, remaining);
  
  return [...explicitlyFeatured, ...latestPosts].map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      featured: true
    }
  }));
}

/**
 * Search posts by query
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Array of matching posts
 */
export async function searchPosts(query, limit = 20) {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const posts = await getAllPosts();
  const searchTerm = query.toLowerCase().trim();
  
  const scoredResults = posts
    .map(post => {
      let score = 0;
      const title = post.frontmatter.title.toLowerCase();
      const content = post.content.toLowerCase();
      const description = post.frontmatter.description.toLowerCase();
      const categories = post.frontmatter.categories.join(' ').toLowerCase();
      const tags = (post.frontmatter.tags || []).join(' ').toLowerCase();
      
      // Title matches (highest score)
      if (title.includes(searchTerm)) score += 10;
      
      // Description matches
      if (description.includes(searchTerm)) score += 5;
      
      // Category matches
      if (categories.includes(searchTerm)) score += 3;
      
      // Tag matches
      if (tags.includes(searchTerm)) score += 2;
      
      // Content matches (lowest score)
      if (content.includes(searchTerm)) score += 1;
      
      return { ...post, searchScore: score };
    })
    .filter(post => post.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
  
  return scoredResults.slice(0, limit);
}

/**
 * Get site statistics
 * @returns {Promise<Object>} Site statistics
 */
export async function getSiteStats() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  
  const totalWords = posts.reduce((sum, post) => 
    sum + (post.frontmatter.schema.wordCount || 0), 0
  );
  
  const avgReadingTime = Math.ceil(
    posts.reduce((sum, post) => 
      sum + (post.frontmatter.schema.readingTime || 0), 0
    ) / posts.length
  );
  
  return {
    totalPosts: posts.length,
    totalCategories: categories.length,
    totalWords,
    avgReadingTime,
    lastUpdated: posts[0]?.frontmatter.date || new Date().toISOString()
  };
}