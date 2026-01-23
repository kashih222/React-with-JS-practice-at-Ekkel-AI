import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../container/Container";
import PostForm from "../post-form/PostForm";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetPostQuery } from "../../store/features/postsApiSlice";

const EditPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const { data: post, isLoading: loading, isError } = useGetPostQuery(slug, {
    skip: !slug,
  });

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    if (!loading && !post && isError) {
       toast.error("Post not found");
       navigate("/");
       return;
    }

    if (!loading && post && userData && post.userId !== userData.$id) {
        toast.error("You are not authorized to edit this post");
        navigate("/");
    }

  }, [slug, navigate, userData, post, loading, isError]);

  useEffect(() => {
    document.title = "Edit Post - MegaBlog";
  }, []);

  if (loading) return  <div className="w-full min-h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;
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
