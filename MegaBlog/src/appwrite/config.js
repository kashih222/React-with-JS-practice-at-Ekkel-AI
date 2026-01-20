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

  // ---------------- Post related Logic ----------------

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          tittle: title,
          slug,
          content,
          featuredimage: featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
      return null;
    }
  }

  async updatePost(id, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id,
        {
          tittle: title,
          content,
          featuredimage: featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
      return null;
    }
  }

  async deletePost(id) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        id
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
        id
      );
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      if (error.code !== 401) {
          console.error("Appwrite service :: getPosts :: error", error);
      }
      return [];
    }
  }

  async getPostBySlug(slug) {
  try {
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("slug", slug)]
    );

    return res.documents[0] || null;
  } catch (error) {
    console.log("Appwrite service :: getPostBySlug :: error", error);
    return null;
  }
}
  //  File Related Logic 

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
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
    return this.bucket.getFilePreview(
      conf.appwriteBucketId,
      fileId
    );
  } catch (error) {
    console.error("Appwrite service :: getFilePreview :: error", error);
    return null;
  }
}

}


const service = new Service();
export default service;
