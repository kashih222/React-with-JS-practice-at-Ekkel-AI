import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import Container from "../container/Container";
import PostCard from "../PostCard";
import MEGABLOG from "../../assets/Mega.png";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts();
        if (response && response.documents) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    document.title = "Home - MegaBlog";
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] text-center flex items-center justify-center">
        <Container>
            <div className="flex justify-center w-full">
                <div className="loader"></div>
            </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Container>
        <div className="w-full mt-4 text-center">
        <Container>
          <h1 className="text-xl text-gray-500 w-full h-80 flex items-center justify-center">
            You have not created any posts yet.
          </h1>
        </Container>
      </div>
      </Container>
    );
  }

  return (
    <div className=" w-full py-8 relative font-mono">
      <div className=" absolute w-full h-screen flex items-center justify-center -z-40">
        <img src={MEGABLOG} alt={MEGABLOG} loading="lazy" className="mb-40 " />
      </div>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
