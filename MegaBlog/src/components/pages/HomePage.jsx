import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import Container from "../container/Container";
import PostCard from "../PostCard";
import MEGABLOG from "../../assets/Mega.png";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUserData(currentUser);

        if (currentUser) {
          const response = await appwriteService.getPosts();
          if (response && response.documents) {
            const myPosts = response.documents.filter(
              (post) => post.userId === currentUser.$id,
            );
            setPosts(myPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching user or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  useEffect(() => {
    document.title = "Home - MegaBlog";
  }, []);

  if (loading) {
    return (
      <div className="w-full h-80 text-center flex items-center justify-center">
        <Container>
            <div class="loader"></div>
        </Container>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold hover:text-gray-500 h-100 flex items-center justify-center">
            Login to Read Post
          </h1>
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
        <img src={MEGABLOG} alt={MEGABLOG} className="mb-40 " />
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
