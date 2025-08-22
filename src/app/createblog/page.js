"use client";

import { useState } from "react";
import Input from "@/app/Components/ui/Input";
import TextArea from "@/app/Components/ui/TextArea";
import Button from "@/app/Components/ui/Button";
import Alert from "@/app/Components/ui/Alert";
import { useAuth } from '@/hooks/useAuth';
import { isValidImageUrl } from '@/lib/utils';

export default function AddPost() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    bannerImage: "",
    category: "",
    summary: "",
    details: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 text-center">
        <Alert type="error" className="mb-4">
          You must be logged in to create a post.
        </Alert>
        <Button as="a" href="/auth/signin">
          Sign In
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, bannerImage, category, summary, details } = formData;
    
    if (!title || !bannerImage || !category || !summary || !details) {
      setMessage("All fields are required!");
      return;
    }

    if (!isValidImageUrl(bannerImage)) {
      setMessage("Please enter a valid image URL (must start with http://, https://, or /)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bannerImage: bannerImage || "/blogbannerimage.jpg",
          authorId: user.id,
          author: {
            name: user.name,
            email: user.email,
            profession: user.profession,
            profilePic: user.profilePic
          }
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Post created successfully!");
        setFormData({
          title: "",
          bannerImage: "",
          category: "",
          summary: "",
          details: ""
        });
      } else {
        setMessage(data.error || "Failed to create post.");
      }
    } catch {
      setMessage("Error while creating post.");
    }
    setLoading(false);
  };



  return (
    <div className="max-w-screen-xl mx-auto p-4 bg-white">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Create a New Post
      </h1>

      {message && (
        <Alert 
          type={message.includes("success") ? "success" : "error"}
          className="mb-4 text-center"
        >
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <Input
            label="Post Title"
            placeholder="Post title"
            value={formData.title}
            onChange={handleChange('title')}
            maxLength={100}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.title.length}/100
          </div>
        </div>
        
        <Input
          label="Banner Image URL *"
          placeholder="Banner image URL (Required)"
          value={formData.bannerImage}
          onChange={handleChange('bannerImage')}
          maxLength={500}
        />
        
        <div>
          <Input
            label="Category"
            placeholder="Post category"
            value={formData.category}
            onChange={handleChange('category')}
            maxLength={50}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.category.length}/50
          </div>
        </div>
        
        <div>
          <TextArea
            label="Summary"
            placeholder="Write a short summary..."
            value={formData.summary}
            onChange={handleChange('summary')}
            height="h-24"
            maxLength={300}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.summary.length}/300
          </div>
        </div>
        
        <div>
          <TextArea
            label="Details"
            placeholder="Write the full details..."
            value={formData.details}
            onChange={handleChange('details')}
            height="h-40"
            maxLength={5000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.details.length}/5000
          </div>
        </div>

        <Button
          type="submit"
          variant="success"
          loading={loading}
          className="w-full"
        >
          Publish Post
        </Button>
      </form>
    </div>
  );
}