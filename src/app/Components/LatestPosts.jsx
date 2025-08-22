"use client";

import Link from "next/link";
import Section from "./ui/Section";
import PostCard from "./ui/PostCard";
import LoadingSpinner from "./ui/LoadingSpinner";
import EmptyState from "./ui/EmptyState";
import Button from "./ui/Button";
import { useFetch } from '@/hooks/useFetch';

const LatestPosts = () => {
  const { data: posts, loading } = useFetch('/api/posts');
  const latestPosts = (posts || []).slice(0, 10);

  if (loading) {
    return (
      <Section title="Latest Posts" centered>
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Section>
    );
  }

  if (latestPosts.length === 0) {
    return (
      <Section>
        <EmptyState 
          title="Latest Posts"
          message="No posts available yet."
          actionText="Create First Post"
          actionHref="/createblog"
        />
      </Section>
    );
  }

  return (
    <Section title="Latest Posts" centered>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      
      {latestPosts.length >= 10 && (
        <div className="text-center mt-8">
          <Button as={Link} href="/post" variant="secondary">
            View All Posts
          </Button>
        </div>
      )}
    </Section>
  );
};

export default LatestPosts;