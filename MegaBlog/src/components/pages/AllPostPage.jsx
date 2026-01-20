import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import PostCard from "../PostCard";
import Container from "../container/Container";

const AllPostPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts();
        if (response && response.documents) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  console.log("ALL POSTS:", posts);

  return (
    <div className="w-full p-4">
      <Container>
        <div className="flex flex-wrap gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.$id} className="w-full sm:w-1/2 lg:w-1/3">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AllPostPage;
