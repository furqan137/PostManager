'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import Header from '@/components/layout/header';
import { Heading } from '@/components/ui/heading';
import PostForm from '@/components/posts/post-form';
import { Post, PostFormData } from '@/lib/types';
import { usePostActions } from '@/lib/actions';

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { updatePost } = usePostActions(setPosts);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id, router]);

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;
    await updatePost(id, data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 container py-8 text-center">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <p className="mt-2 text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <Heading 
          title="Edit Post" 
          description="Make changes to your post"
          className="mb-8 text-center"
        />
        <PostForm 
          initialData={post} 
          onSubmit={handleSubmit} 
          isEditMode 
        />
      </div>
    </div>
  );
}