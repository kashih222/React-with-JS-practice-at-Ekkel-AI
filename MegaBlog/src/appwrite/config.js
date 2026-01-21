import conf from "../conf/conf";
import { ID, Databases, Storage, Query, Client } from "appwrite";

export class Service {
  client;
  databases;
  bucket;

  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  //  POSTS

  async createPost({ tittle, slug, content, featuredimage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          tittle,
          slug,
          content,
          featuredimage,
          status,
          userId,
        },
      );
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
      return null;
    }
  }

  async updatePost(id, data) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
        data,
      );
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
      return null;
    }
  }

  async deletePost(id, deleteFeaturedImage = true) {
    try {
      const post = await this.getPost(id);

      if (deleteFeaturedImage && post?.featuredimage) {
        await this.deleteFile(post.featuredimage);
      }

      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
      );
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(id) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
      );
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      return null;
    }
  }

  async getPostBySlug(slug) {
    try {
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("slug", slug)],
      );
      return res.documents[0] || null;
    } catch (error) {
      console.log("Appwrite service :: getPostBySlug :: error", error);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.error("Appwrite service :: getPosts :: error", error);
      return [];
    }
  }

  async getPostsByUser(userId) {
    try {
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)],
      );
      return res.documents || [];
    } catch (error) {
      console.error("Appwrite service :: getPostsByUser :: error", error);
      return [];
    }
  }

  //  FILES

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: error", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      if (!fileId) return null;
      const url = this.bucket.getFileView(conf.appwriteBucketId, fileId);
      return url.toString();
    } catch (error) {
      console.error("Appwrite service :: getFilePreview :: error", error);
      return null;
    }
  }
}

const service = new Service();
export default service;
