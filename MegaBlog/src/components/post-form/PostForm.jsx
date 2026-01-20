import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import RTE from "../RTE";
import Input from "../Input";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostForm = ({ post }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      if (post) {
        // Update post
        let file = null;

        if (data.image && data.image[0]) {
          file = await appwriteService.uploadFile(data.image[0]);
          if (post.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // Create post
        const file = data.image?.[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (!file) {
          alert("Featured image is required");
          return;
        }

        const dbPost = await appwriteService.createPost({
          ...data,
          featuredImage: file.$id,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      console.error("Post submit error:", error);
    }
  };

  // Auto-generate slug from title
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div className="w-full py-8">
      <form
      onSubmit={handleSubmit(submit)}
      className="max-w-3xl mx-auto space-y-6 flex flex-col flex-wrap"
    >
     <div>
       <h1 className="text-xl mb-4 uppercase">
        Content
      </h1>
     </div>
      <Input
        label="Title"
        placeholder="Enter post title"
        {...register("title", { required: true })}
      />

      <Input
        label="Slug"
        placeholder="post-slug"
        {...register("slug", { required: true })}
      />

      <RTE
        label="Content"
        name="content"
        control={control}
        defaultValue={getValues("content")}
      />

      <Input
        label="Featured Image"
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        {...register("image", { required: !post })}
      />

      <select
        className="w-full border rounded-lg px-3 py-2"
        {...register("status", { required: true })}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <Button type="submit" className="w-full">
        {post ? "Update Post" : "Create Post"}
      </Button>
    </form>
    </div>
  );
};

export default PostForm;
