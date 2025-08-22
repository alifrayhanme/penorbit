"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { buildSearchUrl } from '@/lib/utils';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAdmin } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(buildSearchUrl(searchQuery.trim()));
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Brand Logo" width={32} height={32} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            PenOrbit
          </span>
        </Link>

        <div className="flex lg:order-2 items-center">
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search posts..."
            />
          </form>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 ms-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>

        <div className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${isMenuOpen ? "block" : "hidden"}`}>
          <form onSubmit={handleSearch} className="relative mt-3 lg:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Search posts..."
            />
          </form>

          <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:space-x-8 lg:flex-row lg:mt-0 lg:border-0 lg:bg-white">
            <li>
              <Link href="/" className="block py-2 px-3 text-blue-700 lg:p-0">
                Home
              </Link>
            </li>
            <li>
              <Link href="/post" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                Posts
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/createblog" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                    Create Blog
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                    Profile
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                      Admin
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={logout}
                    className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
            {!user && (
              <>
                <li>
                  <Link href="/auth/signin" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="block py-2 px-3 text-gray-900 hover:text-blue-700 lg:p-0">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;