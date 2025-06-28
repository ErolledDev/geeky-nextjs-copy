import Base from "@layouts/Baseof";
import { slugify } from "@lib/utils/textConverter";
import Post from "@partials/Post";
import { searchPosts } from "@lib/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query.key || '');

  useEffect(() => {
    if (query.key) {
      performSearch(query.key);
    }
  }, [query.key]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchPosts(searchTerm, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?key=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/search?key=${encodeURIComponent(query.key || '')}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": searchResults.length,
      "itemListElement": searchResults.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "BlogPosting",
          "headline": post.frontmatter.title,
          "description": post.frontmatter.description,
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${post.slug}`
        }
      }))
    }
  };

  return (
    <Base 
      title={`Search results for "${query.key || ''}"`}
      description={`Search results for "${query.key || ''}" - Find relevant articles and content.`}
      noindex={true}
      structuredData={structuredData}
    >
      <div className="section pt-16">
        <div className="container">
          {/* Enhanced Search Header */}
          <div className="text-center mb-12">
            <h1 className="h2 mb-4">
              {query.key ? (
                <>
                  Search results for <span className="text-primary">"{query.key}"</span>
                </>
              ) : (
                'Search Articles'
              )}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, categories, or topics..."
                  className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                </button>
              </div>
            </form>

            {/* Search Stats */}
            {query.key && !loading && (
              <p className="text-gray-600 dark:text-gray-400">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                  : 'No results found'
                }
              </p>
            )}
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="text-center py-24">
              <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="row">
              {searchResults.map((post, i) => (
                <div key={`search-result-${i}`} className="col-12 mb-8 sm:col-6 lg:col-4">
                  <Post post={post} />
                </div>
              ))}
            </div>
          ) : query.key ? (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn't find any articles matching "{query.key}". Try different keywords or browse our categories.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Suggestions:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Try more general keywords</li>
                    <li>• Use fewer keywords</li>
                    <li>• Browse our categories</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Start your search</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter keywords above to find relevant articles and content.
              </p>
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;