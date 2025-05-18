'use client';

import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/types';
import PostCard from '@/components/posts/post-card';
import { usePostActions } from '@/lib/actions';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { deletePost } = usePostActions(setPosts);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts?query=${searchQuery}&sort=createdAt&order=${sortOrder}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [searchQuery, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="min-w-20"
          onClick={toggleSortOrder}
          aria-label={`Sort by date ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
        >
          {sortOrder === 'desc' ? (
            <SortDesc className="h-4 w-4 mr-2" />
          ) : (
            <SortAsc className="h-4 w-4 mr-2" />
          )}
          {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-64"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={deletePost} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? `No posts matching "${searchQuery}"`
              : "It looks like there aren't any posts yet."}
          </p>
        </div>
      )}
    </div>
  );
}