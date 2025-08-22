"use client";

import Link from "next/link";
import { FaCode, FaHeart, FaPlane, FaUtensils, FaGamepad, FaBook } from "react-icons/fa";
import { useFetch } from '@/hooks/useFetch';
import { buildSearchUrl } from '@/lib/utils';

const categoryIcons = {
  "Tech": FaCode,
  "Technology": FaCode,
  "Lifestyle": FaHeart,
  "Travel": FaPlane,
  "Food": FaUtensils,
  "Gaming": FaGamepad,
  "Education": FaBook,
  "Welcome": FaBook,
  "General": FaBook
};

const Categories = () => {
  const { data: posts } = useFetch('/api/posts');

  if (!posts?.length) return null;

  const uniqueCategories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  const categories = uniqueCategories.map(cat => ({
    name: cat,
    count: posts.filter(post => post.category === cat).length,
    icon: categoryIcons[cat] || FaBook
  }));

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link 
                key={category.name}
                href={buildSearchUrl('', category.name)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center group"
              >
                <IconComponent className="text-3xl text-blue-600 mx-auto mb-3 group-hover:text-blue-700" />
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} posts</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;