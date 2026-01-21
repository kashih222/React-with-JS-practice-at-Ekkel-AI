import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../container/Container";
import PostForm from "../post-form/PostForm";
import appwriteService from "../../appwrite/config";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EditPostPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate("/");
        return;
      }

      try {
        const fetchedPost = await appwriteService.getPostBySlug(slug);

        if (!fetchedPost) {
          toast.error("Post not found");
          navigate("/");
          return;
        }

        if (fetchedPost.userId !== userData?.$id) {
          toast.error("You are not authorized to edit this post");
          navigate("/");
          return;
        }

        setPost(fetchedPost);
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Failed to fetch post");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (userData) fetchPost();
  }, [slug, navigate, userData]);

  useEffect(() => {
    document.title = "Edit Post - MegaBlog";
  }, []);

  if (loading) return <div className="p-6 text-center mt-18 flex items-center  justify-center h-18 w-full">Loading post...</div>;
  if (!post) return <div className="p-6 text-center mt-18 flex items-center  justify-center h-18 w-full">Post not found.</div>;

  return (
    <div className="w-full py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Post</h1>
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  );
};

export default EditPostPage;
