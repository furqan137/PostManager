'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/types';

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

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
            The post you're lookin for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Back to posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <article className="max-w-3xl mx-auto prose dark:prose-invert lg:prose-lg">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
        </article>
      </div>
    </div>
  );
}
