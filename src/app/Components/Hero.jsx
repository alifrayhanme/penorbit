"use client";

import Link from "next/link";
import Button from "./ui/Button";
import FeaturedPost from "./hero/FeaturedPost";
import SidePost from "./hero/SidePost";
import { useFetch } from '@/hooks/useFetch';

const Hero = () => {
  const { data: allPosts } = useFetch('/api/posts');
  const posts = (allPosts || []).slice(0, 3);

  if (posts.length === 0) {
    return (
      <div className=" relative h-96 sm:h-[600px] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to PenOrbit
          </h1>
          <p className="text-xl mb-6">Discover amazing stories and insights</p>
          <Button as={Link} href="/createblog" size="lg" className="rounded-full">
            Start Writing
          </Button>
        </div>
      </div>
    );
  }

  const [mainPost, ...sidePosts] = posts;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
        {mainPost && <FeaturedPost post={mainPost} />}
        <div className="flex flex-col h-full gap-4">
          {sidePosts.map(post => (
            <SidePost key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
