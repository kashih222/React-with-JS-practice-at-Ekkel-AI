import { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import PostCard from "../PostCard";
import Container from "../container/Container";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AllPostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    document.title = "All Post - MegaBlog";
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (userData) {
            const userPosts = await appwriteService.getPostsByUser(userData.$id);
            setPosts(userPosts);
        }
      } catch (error) {
        toast.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Container>
      <div className="w-full py-8 relative">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        ) : (
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-500">
              You don&apos;t have any post yet
            </h1>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AllPostPage;
