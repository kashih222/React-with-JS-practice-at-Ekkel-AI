import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "../Button";
import RTE from "../RTE";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../../store/features/postsApiSlice"; 
import LoadingSpinner from "../LoadingSpinner";

const PostForm = ({ post }) => {
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const {
    register,
    handleSubmit,
    
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tittle: post?.tittle || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
      author: post?.author || userData?.name || "",
    },
  });

  const navigate = useNavigate();

  const submit = async (data) => {
    setLoading(true);
    
    try {
      let currentUser = userData;
      if (!currentUser) {
        toast.error("Please login to create or update posts");
        setLoading(false);
        return;
      }

      let fileId = post?.featuredimage || null;

      // Handle image upload if a new image is provided
      if (data.image && data.image[0]) {
        toast.loading("Uploading image...", { id: "image-upload" });
        
        try {
          const uploadedFile = await uploadFile(data.image[0]).unwrap();
          
          if (!uploadedFile || !uploadedFile.$id) {
            toast.error("Image upload failed", { id: "image-upload" });
            setLoading(false);
            return;
          }

          // Delete old image if updating
          if (post?.featuredimage) {
            await deleteFile(post.featuredimage).unwrap();
          }

          fileId = uploadedFile.$id;
          toast.success("Image uploaded successfully", { id: "image-upload" });
        } catch (error) {
          toast.error("Image upload failed", { id: "image-upload" });
          console.log(error)
          setLoading(false);
          return;
        }
      }

      const postData = {
        tittle: data.tittle,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredimage: fileId,
        userId: currentUser.$id,
        author: data.author,
      };

      let response;

      if (post) {
        // UPDATE POST
        toast.loading("Updating post...", { id: "post-update" });
        try {
          response = await updatePost({ 
            postId: post.$id, 
            postData 
          }).unwrap();
          toast.success("Post updated successfully", { id: "post-update" });
        } catch (error) {
          toast.error("Failed to update post", { id: "post-update" });
          console.log(error)
          setLoading(false);
          return;
        }
      } else {
        // CREATE POST
        if (!fileId) {
          toast.error("Featured image is required");
          setLoading(false);
          return;
        }

        toast.loading("Creating post...", { id: "post-create" });
        try {
          response = await createPost(postData).unwrap();
          toast.success("Post created successfully", { id: "post-create" });
        } catch (error) {
          toast.error("Failed to create post", { id: "post-create" });
          console.log(error)
          setLoading(false);
          return;
        }
      }

      if (response && response.slug) {
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate(`/post/${response.slug}`);
        }, 1000);
      } else {
        toast.error("Post saved but slug missing");
        setLoading(false);
      }

    } catch (error) {
      console.error("Post submit error:", error);
      toast.error(`Failed to ${post ? "update" : "create"} post`);
      setLoading(false);
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

  const title = useWatch({ control, name: "tittle" });

  useEffect(() => {
    const slug = slugTransform(title);
    setValue("slug", slug, { shouldValidate: true });
  }, [title, slugTransform, setValue]);

  // Combine loading states
  const isLoading = loading || isCreating || isUpdating;

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
          {...register("tittle", { 
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters"
            }
          })}
          error={errors.tittle?.message}
        />

        <Input
          label="Author"
          placeholder="Enter author name"
          {...register("author", { 
            required: "Author name is required" 
          })}
          error={errors.author?.message}
        />

        <Input
          label="Slug"
          placeholder="post-slug"
          {...register("slug", { 
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: "Slug can only contain lowercase letters, numbers, and hyphens"
            }
          })}
          error={errors.slug?.message}
        />

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          error={errors.content?.message}
        />

        <div className="space-y-2">
          <Input
            label="Featured Image"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            {...register("image", { 
              required: !post ? "Featured image is required" : false 
            })}
            error={errors.image?.message}
          />
          {post?.featuredimage && (
            <p className="text-sm text-gray-500">
              Current image will be replaced if you upload a new one
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("status", { required: true })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Button 
          type="submit" 
          className={`w-full cursor-pointer flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner/>
              {post ? "Updating Post..." : "Creating Post..."}
            </>
          ) : (
            post ? "Update Post" : "Create Post"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PostForm;