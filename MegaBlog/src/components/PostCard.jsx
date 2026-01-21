import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

const PostCard = ({
  tittle,
  featuredimage,
  content,
  $createdAt,
  slug,
}) => {
  const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  const loadImage = () => {
    if (!featuredimage) return;

    const url = appwriteService.getFilePreview(featuredimage);
    setImageUrl(url);
  };

  loadImage();
}, [featuredimage]);

  return (
    <Link to={`/post/${slug}`}>
      <div className="bg-white -z-40 w-full h-103 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">

        {imageUrl && (
          <img
            src={imageUrl}
            alt={tittle}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{tittle}</h2>

          <div
            className="text-gray-700 mb-4 w-full h-18 overflow-hidden prose max-w-none line-clamp-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {$createdAt ? new Date($createdAt).toLocaleDateString() : ""}
            </span>
          </div>

          <span className="inline-block mt-4 text-orange-700 font-medium hover:underline">
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
