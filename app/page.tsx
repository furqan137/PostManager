import Header from '@/components/layout/header';
import { Heading } from '@/components/ui/heading';
import PostsList from '@/components/posts/posts-list';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <Heading 
          title="Posts" 
          description="Browse and manage your posts"
          className="mb-8"
        />
        <PostsList />
      </div>
    </div>
  );
}