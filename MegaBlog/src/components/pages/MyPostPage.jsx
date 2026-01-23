import { useEffect } from "react";
import PostCard from "../PostCard";
import Container from "../container/Container";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetPostsByUserQuery } from "../../store/features/postsApiSlice";

const MyPostPage = () => {
  const userData = useSelector((state) => state.auth.userData);
  
  const { data: posts = [], isLoading: loading, isError, error } = useGetPostsByUserQuery(userData?.$id, {
    skip: !userData,
  });

  useEffect(() => {
    document.title = "My Post - MegaBlog";
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching posts: " + (error?.data || error?.message || "Unknown error"));
    }
  }, [isError, error]);

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

export default MyPostPage;
