import { createContext, useContext, useEffect, useState } from "react";
import { getAllPosts } from "../lib/api";

const SearchContext = createContext();

export const JsonContext = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const state = {
    posts,
    loading,
  };

  return (
    <SearchContext.Provider value={state}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};