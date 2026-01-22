import  { useCallback, useEffect } from "react";
import { useForm, Watch } from "react-hook-form";
import Button from "../Button";
import RTE from "../RTE";
import Input from "../Input";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

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
      tittle: post?.tittle || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  
const submit = async (data) => {
  try {
    let currentUser = userData;
    if (!currentUser) {
       const sessionUser = await authService.getCurrentUser();
       if (sessionUser) currentUser = sessionUser;
    }

    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }

    let fileId = post?.featuredimage || null;

    if (data.image && data.image[0]) {
      const uploadedFile = await appwriteService.uploadFile(data.image[0]);

      if (!uploadedFile || !uploadedFile.$id) {
        toast.error("Image upload failed");
        return;
      }

      
      if (post?.featuredimage) {
        await appwriteService.deleteFile(post.featuredimage);
      }

      fileId = uploadedFile.$id;
    }

    const postData = {
      tittle: data.tittle,
      slug: data.slug,
      content: data.content,
      status: data.status,
      featuredimage: fileId,
      userId: currentUser.$id,
    };

    let response;

    if (post) {
      // UPDATE POST
      response = await appwriteService.updatePost(post.$id, postData);
      toast.success("Post Updated Sucessfully")
    } else {
      // CREATE POST
      if (!fileId) {
        toast.error("Featured image is required");
        return;
      }

      response = await appwriteService.createPost(postData);
      toast.success('Blog Added Sucessfully')
    }


    if (response && response.slug) {
      navigate(`/post/${response.slug}`);  
    } else {
      toast.error("Post saved but slug missing");
    }

  } catch (error) {
    console.error("Post submit error:", error);
    toast.error("Failed to submit post");
  }
};

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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "tittle") {
        setValue("slug", slugTransform(value.tittle), {
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
        <h1 className="text-xl mb-4 uppercase">Content</h1>

        <Input
          label="Title"
          placeholder="Enter post title"
          {...register("tittle", { required: true })}
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

        <Button type="submit" className="w-full cursor-pointer">
          {post ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;
