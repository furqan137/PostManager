'use client';

import { usePostActions } from '@/lib/actions';
import { useState } from 'react';
import Header from '@/components/layout/header';
import { Heading } from '@/components/ui/heading';
import PostForm from '@/components/posts/post-form';
import { PostFormData } from '@/lib/types';

export default function NewPostPage() {
  const [posts, setPosts] = useState([]);
  const { createPost } = usePostActions(setPosts);

  const handleSubmit = async (data: PostFormData) => {
    await createPost(data);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <Heading 
          title="Create a New Post" 
          description="Add a new post to your collection"
          className="mb-8 text-center"
        />
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}