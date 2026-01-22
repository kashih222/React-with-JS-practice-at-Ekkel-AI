import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import Container from "../container/Container";
import Button from "../Button";
import appwriteService from "../../appwrite/config";
import toast from "react-hot-toast";

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug || !authStatus || !userData) return;

    const fetchPost = async () => {
      try {
        const fetchedPost = await appwriteService.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        navigate("/");
      }
    };

    fetchPost();
  }, [slug, userData, authStatus, navigate]);

  useEffect(() => {
    document.title = post ? `${post.tittle} - MegaBlog` : "Post - MegaBlog";
  }, [post]);

  const deletePost = async () => {
    try {
      await appwriteService.deletePost(post.$id);

      if (post.featuredimage) {
        await appwriteService.deleteFile(post.featuredimage);
      }

      toast.success("Post deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post.");
    }
  };

  if (!post) {
    return (
      <div className="p-6 text-center mt-18 flex items-center  justify-center h-80 w-full">
        <Container>
          <div className="loader"></div>
        </Container>
      </div>
    );
  }

  const imageUrl = post.featuredimage
    ? appwriteService.getFilePreview(post.featuredimage)
    : null;

  return (
    <Container>
      <div className="p-4 pb-47 pt-20">
        <div className="flex justify-center mb-4 relative border rounded-xl p-2">
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
                <Button bgColor="bg-green-500" className="">
                  Edit
                </Button>
              </Link>

              <Button bgColor="bg-red-500" onClick={() => setShowConfirm(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">{post.tittle}</h1>

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="prose max-w-full mx-auto text-center"
        />
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Delete Post
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post?
              <br />
              <span className="text-red-500 font-medium">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  deletePost();
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PostPage;
