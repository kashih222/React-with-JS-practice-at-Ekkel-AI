import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)       
      .setProject(conf.appwriteProjectId); 

    this.account = new Account(this.client);
  }

  /**
   * Signup / Create a new user account
   */
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(), 
        email,
        password,
        name
      );
      return userAccount;
    } catch (error) {
      console.error("Appwrite service :: createAccount :: error", error);
      if (error.message.includes("already exists")) {
        throw new Error("Email already registered. Please login instead.");
      }
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
      if (error.message.includes("Invalid credentials")) {
        throw new Error("Invalid email or password. Please try again.");
      }
      throw error;
    }
  }

  /**
   * Get the currently logged-in user
   */
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      // 401 means user is not logged in
      if (error.code !== 401) {
        console.error("Appwrite service :: getCurrentUser :: error", error);
      }
      return null;
    }
  }

  /**
   * Logout the current user
   */
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
