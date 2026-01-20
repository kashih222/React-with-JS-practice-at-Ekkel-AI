import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "../container/Container";
import Button from "../Button";
import appwriteService from "../../appwrite/config";

const PostPage = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      const fetchedPost = await appwriteService.getPostBySlug(slug);

      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        navigate("/");
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await appwriteService.deletePost(post.$id);

      if (post.featuredimage) {
        await appwriteService.deleteFile(post.featuredimage);
      }

      alert("Post deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  if (!post) return <div className="p-6 text-center">Loading post...</div>;

  const imageUrl = post.featuredimage
    ? appwriteService.getFilePreview(post.featuredimage)
    : null;

  return (
    <div className="p-4">
      <Container>
        <div className="w-full h-150 flex justify-center mb-4 relative border rounded-xl p-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={post.tittle}
              className="rounded-xl max-h-125 object-cover"
            />
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6 flex space-x-3">
              <Link to={`/edit-post/${post.slug}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>

              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">
          {post.tittle}
        </h1>

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="prose max-w-full mx-auto text-center"
        />
      </Container>
    </div>
  );
};

export default PostPage;
