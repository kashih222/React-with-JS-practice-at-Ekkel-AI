// src/store/features/postsApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react'
import appwriteService from '../../appwrite/config'

// Custom base query for Appwrite
const appwriteBaseQuery = async (args) => {
  const { endpoint, body = 'GET', params = [] } = args
  
  try {
    let result
    
    switch (endpoint) {
      case 'getPosts':
        result = await appwriteService.getPosts()
        break
      case 'getPostsByUser':
        result = await appwriteService.getPostsByUser(params[0])
        break
      case 'getPostBySlug':
        result = await appwriteService.getPostBySlug(params[0])
        break
      case 'getPost':
        result = await appwriteService.getPost(params[0])
        break
      case 'createPost':
        result = await appwriteService.createPost(body)
        break
      case 'updatePost':
        result = await appwriteService.updatePost(params[0], body)
        break
      case 'deletePost':
        result = await appwriteService.deletePost(params[0])
        break
      case 'uploadFile':
        result = await appwriteService.uploadFile(body)
        break
      case 'deleteFile':
        result = await appwriteService.deleteFile(params[0])
        break
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`)
    }
    
    return { data: result }
  } catch (error) {
    console.error('Appwrite API error:', error)
    return {
      error: {
        status: error.code || 500,
        data: error.message || 'Unknown error',
      },
    }
  }
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: appwriteBaseQuery,
  tagTypes: ['Post', 'File'],
  endpoints: (builder) => ({
    // GET all posts (with caching)
    getPosts: builder.query({
      query: () => ({
        endpoint: 'getPosts',
      }),
      providesTags: (result) => {
        // Handle response format from appwriteService.getPosts()
        // It returns { documents: [...] } or []
        const posts = result?.documents || result || [];
        return Array.isArray(posts)
          ? [
              ...posts.map(({ $id }) => ({ type: 'Post', id: $id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }];
      },
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // GET posts by user
    getPostsByUser: builder.query({
      query: (userId) => ({
        endpoint: 'getPostsByUser',
        params: [userId],
      }),
      providesTags: (result) => {
        // getPostsByUser returns an array or []
        const posts = result || [];
        return Array.isArray(posts)
          ? [
              ...posts.map(({ $id }) => ({ type: 'Post', id: $id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }];
      },
      keepUnusedDataFor: 300,
    }),
    
   // Update the getPost endpoint in postsApiSlice.js to use getPostBySlug
getPost: builder.query({
  query: (slug) => ({
    endpoint: 'getPostBySlug', 
    params: [slug],
  }),
  providesTags: (result, error, slug) => [
    { type: 'Post', id: result?.$id || slug },
  ],
  keepUnusedDataFor: 300,
}),
    
    // CREATE new post
    createPost: builder.mutation({
      query: (postData) => ({
        endpoint: 'createPost',
        body: postData,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    
    // UPDATE existing post
    updatePost: builder.mutation({
      query: ({ postId, postData }) => ({
        endpoint: 'updatePost',
        params: [postId],
        body: postData,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { postData }) => [
        { type: 'Post', id: postData.slug },
      ],
    }),
    
    // DELETE post
    deletePost: builder.mutation({
      query: (postId) => ({
        endpoint: 'deletePost',
        params: [postId],
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    
    // UPLOAD file
    uploadFile: builder.mutation({
      query: (file) => ({
        endpoint: 'uploadFile',
        body: file,
        method: 'POST',
      }),
      providesTags: ['File'],
    }),
    
    // DELETE file
    deleteFile: builder.mutation({
      query: (fileId) => ({
        endpoint: 'deleteFile',
        params: [fileId],
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostsByUserQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
  useLazyGetPostQuery,
} = postsApi