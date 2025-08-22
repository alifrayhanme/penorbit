"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { isValidImageUrl } from "@/lib/utils";
import { defaultPost } from "@/lib/defaultPost";

const Hero = () => {
  const { data: posts = [] } = useFetch("/api/posts");
  const slides = posts.length ? posts.slice(0, 3) : [defaultPost];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => setCurrent(i => (i + 1) % slides.length), 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const post = slides[current];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 rounded overflow-hidden relative">
          {isValidImageUrl(post.bannerImage) ? (
            <Image src={post.bannerImage} alt={post.title} fill className="object-cover" priority />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold line-clamp-2">{post.title}</h1>
          <p className="text-gray-600 line-clamp-3">{post.summary}</p>
          <Button as={Link} href={post._id === 'default-1' ? '/createblog' : `/post/${post._id}`} size="lg">
            {post._id === 'default-1' ? 'Start Writing' : 'Read More'}
          </Button>
        </div>
      </div>
      
      {slides.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? "bg-blue-600" : "bg-gray-400"}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
