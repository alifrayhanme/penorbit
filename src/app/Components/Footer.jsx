"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <footer className="bg-white text-gray-700 py-10 mt-12 ">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand / About */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-start gap-1">
              <Image src="/logo.png" width={32} height={32} alt="footer logo" />
              PenOrbit
            </h2>
            <p className="text-sm leading-relaxed">
              Sharing knowledge, stories, and insights on business, travel, and
              technology. Stay connected and keep learning!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/post" className="hover:text-blue-600 transition">
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-xl text-gray-600">
              <Link href="https://facebook.com" target="_blank">
                <FaFacebook className="hover:text-blue-600 transition" />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <FaTwitter className="hover:text-blue-400 transition" />
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <FaLinkedin className="hover:text-blue-700 transition" />
              </Link>
              <Link href="https://github.com" target="_blank">
                <FaGithub className="hover:text-black transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <Link className="text-blue-600 hover:underline" href="/">
            PenOrbit
          </Link>
          . All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
