"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./ui/SearchForm";
import NavLink from "./ui/NavLink";
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

  const navItems = [
    { href: "/", label: "Home", active: true },
    { href: "/post", label: "Posts" },
    ...(user ? [
      { href: "/createblog", label: "Create Blog" },
      { href: "/profile", label: "Profile" },
      ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
      { onClick: logout, label: "Sign Out" }
    ] : [
      { href: "/auth/signin", label: "Sign In" },
      { href: "/auth/signup", label: "Sign Up" }
    ])
  ];

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
          <SearchForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearch}
            className="hidden lg:block"
          />

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
          <SearchForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearch}
            className="mt-3 lg:hidden"
          />

          <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:space-x-8 lg:flex-row lg:mt-0 lg:border-0 lg:bg-white">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  href={item.href}
                  active={item.active}
                  onClick={item.onClick}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;