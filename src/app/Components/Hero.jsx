"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";
import { useFetch } from '@/hooks/useFetch';
import { isValidImageUrl } from '@/lib/utils';

const Hero = () => {
  const { data: allPosts } = useFetch('/api/posts');
  const posts = (allPosts || []).slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (posts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % posts.length);
      }, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [posts.length]);

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

  return (
    <div className="relative  overflow-hidden max-w-screen-xl mx-auto px-4 py-10">
      {/* Carousel Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {posts.map((post, index) => {
          return (
            <div
              key={post._id}
              className="w-full h-full flex-shrink-0 relative bg-white"
            >
              <div className="relative z-10 h-full grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
                {/* Left Side - Image */}
                <div className="w-full">
                  {isValidImageUrl(post.bannerImage) ? (
                    <div className="relative w-full h-96">
                      <Image
                        src={post.bannerImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-lg"
                        priority={index === 0}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Right Side - Content */}
                <div className="sm:h-96 text-gray-800">
                  <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                    {post.title}
                  </h1>
                  <p className="text-lg mb-8 leading-relaxed text-gray-600">
                    {post.summary}
                  </p>
                  <Button 
                    as={Link} 
                    href={`/post/${post._id}`}
                    size="lg"
                    className="rounded-full shadow-lg"
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {posts.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-blue-600 scale-110" 
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
