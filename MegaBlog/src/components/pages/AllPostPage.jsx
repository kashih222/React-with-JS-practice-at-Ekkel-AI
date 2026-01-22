import { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import PostCard from "../PostCard";
import Container from "../container/Container";
import toast from "react-hot-toast";
import MEGABLOG from "../../assets/Mega.png";

const AllPostPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "All Post - MegaBlog";
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts();
        if (response && response.documents) {
          setPosts(response.documents);
        }
      } catch (error) {
        toast.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      <div className="w-full py-8 relative">
        <div className=" absolute w-full h-screen flex items-center justify-center -z-40">
          <img src={MEGABLOG} alt={MEGABLOG} className="mb-40 " />
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        ) : (
          <div className="w-full h-80 flex flex-col items-center justify-center">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AllPostPage;
