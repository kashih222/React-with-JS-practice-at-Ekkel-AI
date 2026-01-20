import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../container/Container";
import PostForm from "../post-form/PostForm";
import appwriteService from "../../appwrite/config";

const EditPostPage = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        } else {
          navigate("/");
        }
        setLoading(false);
      });
    } else {
      navigate("/");
      setLoading(false);
    }
  }, [slug, navigate]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found.</div>;

  return post ? (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <Container> 
        <PostForm post={post} />
      </Container>
    </div>
  ) : null
};

export default EditPostPage;
