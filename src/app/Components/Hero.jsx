"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";
import { useFetch } from '@/hooks/useFetch';
import { isValidImageUrl, formatDate } from '@/lib/utils';

const Hero = () => {
  const { data: allPosts } = useFetch('/api/posts');
  const posts = (allPosts || []).slice(0, 3);

  if (posts.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
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
        {/* Left Side - Main Featured Post */}
        {mainPost && (
          <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/post/${mainPost._id}`}>
              <div className="relative h-64 lg:h-full">
                {isValidImageUrl(mainPost.bannerImage) ? (
                  <Image
                    src={mainPost.bannerImage}
                    alt={mainPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {mainPost.category || 'Featured'}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2">
                    {mainPost.title}
                  </h3>
                  <p className="text-gray-200 mb-3 line-clamp-2">
                    {mainPost.summary}
                  </p>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>{mainPost.author?.name || 'Anonymous'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(mainPost.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Right Side - Two Smaller Posts */}
        <div className="flex flex-col h-full gap-4">
          {sidePosts.map((post, index) => (
            <div key={post._id} className="group cursor-pointer flex-1">
              <Link href={`/post/${post._id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
                  <div className="flex sm:flex-row flex-col h-full">
                    <div className="sm:w-2/5 w-full sm:h-full h-32 relative">
                      {isValidImageUrl(post.bannerImage) ? (
                        <Image
                          src={post.bannerImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="sm:w-3/5 w-full p-4 flex flex-col justify-between">
                      <div>
                        <div className="mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {post.category || 'Article'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {post.summary}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{post.author?.name || 'Anonymous'}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
