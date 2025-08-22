"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/app/Components/ui/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">An error occurred while loading this page.</p>
        <div className="space-x-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button as={Link} href="/" variant="secondary">Go Home</Button>
        </div>
      </div>
    </div>
  );
}