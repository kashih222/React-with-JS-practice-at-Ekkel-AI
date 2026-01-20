import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

const PostCard = ({
  $id,
  tittle,
  featuredimage,
  content,
  $createdAt,
  slug,
}) => {
  return (
    <Link to={`/post/${$id}`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          src={appwriteService.getFilePreview(featuredimage)}
          alt={tittle}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{tittle}</h2>

          <div
            className="text-gray-700 mb-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {$createdAt ? new Date($createdAt).toLocaleDateString() : ""}
            </span>
          </div>

          <Link
            to={`/post/${slug}`}
            className="inline-block mt-4 text-orange-700 font-medium hover:underline"
          >
            Read More
          </Link>

        </div>
      </div>
    </Link>
  );
};

export default PostCard;
