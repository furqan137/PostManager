'use client';

import { Post, PostFormData } from './types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface OptimisticAction {
  action: 'create' | 'update' | 'delete';
  data?: Post;
  id?: string;
}

// Custom hook for managing posts with optimistic updates
export function usePostActions(setPosts: React.Dispatch<React.SetStateAction<Post[]>>) {
  const router = useRouter();
  const { toast } = useToast();

  // Function to create a post with optimistic update
  async function createPost(formData: PostFormData) {
    // Create a temporary post for optimistic update
    const optimisticPost: Post = {
      _id: Date.now().toString(), // Temporary ID
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update the UI
    setPosts((prevPosts) => [optimisticPost, ...prevPosts]);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const newPost = await response.json();

      // Update posts with actual server data
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === optimisticPost._id ? newPost : post
        )
      );

      toast({
        title: 'Success',
        description: 'Post created successfully',
      });

      return newPost;
    } catch (error: any) {
      // Revert optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== optimisticPost._id)
      );

      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create post',
      });

      throw error;
    } finally {
      router.refresh();
    }
  }

  // Function to update a post with optimistic update
  async function updatePost(id: string, formData: PostFormData) {
    // Save the original post for rollback if needed
    let originalPost: Post | undefined;

    // Optimistically update the UI
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post._id === id) {
          originalPost = { ...post };
          return {
            ...post,
            ...formData,
            updatedAt: new Date().toISOString(),
          };
        }
        return post;
      });
      return updatedPosts;
    });

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      const updatedPost = await response.json();

      // Update with actual server data
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? updatedPost : post))
      );

      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });

      return updatedPost;
    } catch (error: any) {
      // Revert optimistic update on error
      if (originalPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === id ? originalPost! : post))
        );
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update post',
      });

      throw error;
    } finally {
      router.refresh();
    }
  }

  // Function to delete a post with optimistic update
  async function deletePost(id: string) {
    // Save the post for rollback if needed
    let deletedPost: Post | undefined;
    let deletedIndex = -1;

    // Optimistically update the UI
    setPosts((prevPosts) => {
      const index = prevPosts.findIndex((post) => post._id === id);
      if (index !== -1) {
        deletedPost = prevPosts[index];
        deletedIndex = index;
      }
      return prevPosts.filter((post) => post._id !== id);
    });

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error: any) {
      // Revert optimistic update on error
      if (deletedPost && deletedIndex !== -1) {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts];
          updatedPosts.splice(deletedIndex, 0, deletedPost!);
          return updatedPosts;
        });
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete post',
      });

      throw error;
    } finally {
      router.refresh();
    }
  }

  return { createPost, updatePost, deletePost };
}