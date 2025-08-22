"use client";

import { useState } from "react";
import Input from "@/app/Components/ui/Input";
import TextArea from "@/app/Components/ui/TextArea";
import Button from "@/app/Components/ui/Button";
import FormField from "@/app/Components/ui/FormField";
import Toast from "@/app/Components/ui/Toast";
import AuthGuard from "@/app/Components/ui/AuthGuard";
import PageContainer from "@/app/Components/ui/PageContainer";
import { useAuth } from '@/hooks/useAuth';
import { useMessage } from '@/hooks/useMessage';
import { useApi } from '@/hooks/useApi';
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
  const { message, setMessage, showSuccess, showError } = useMessage();
  const api = useApi();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, bannerImage, category, summary, details } = formData;
    
    if (!title || !bannerImage || !category || !summary || !details) {
      setMessage("All fields are required!");
      return;
    }

    if (!isValidImageUrl(bannerImage)) {
      showError("Please enter a valid image URL");
      return;
    }

    const result = await api.post("/api/posts", {
      ...formData,
      bannerImage: bannerImage || "/blogbannerimage.jpg",
      authorId: user.id,
      author: {
        name: user.name,
        email: user.email,
        profession: user.profession,
        profilePic: user.profilePic
      }
    });

    if (result.success) {
      showSuccess("Post created");
      setFormData({ title: "", bannerImage: "", category: "", summary: "", details: "" });
    } else {
      showError(result.error);
    }
  };



  return (
    <AuthGuard>
      <PageContainer className="bg-white">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Create a New Post
      </h1>



      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormField showCounter currentLength={formData.title.length} maxLength={100}>
          <Input
            label="Post Title"
            placeholder="Post title"
            value={formData.title}
            onChange={handleChange('title')}
            maxLength={100}
          />
        </FormField>
        
        <Input
          label="Banner Image URL *"
          placeholder="Banner image URL (Required)"
          value={formData.bannerImage}
          onChange={handleChange('bannerImage')}
          maxLength={500}
        />
        
        <FormField showCounter currentLength={formData.category.length} maxLength={50}>
          <Input
            label="Category"
            placeholder="Post category"
            value={formData.category}
            onChange={handleChange('category')}
            maxLength={50}
          />
        </FormField>
        
        <FormField showCounter currentLength={formData.summary.length} maxLength={300}>
          <TextArea
            label="Summary"
            placeholder="Write a short summary..."
            value={formData.summary}
            onChange={handleChange('summary')}
            height="h-24"
            maxLength={300}
          />
        </FormField>
        
        <FormField showCounter currentLength={formData.details.length} maxLength={5000}>
          <TextArea
            label="Details"
            placeholder="Write the full details..."
            value={formData.details}
            onChange={handleChange('details')}
            height="h-40"
            maxLength={5000}
          />
        </FormField>

        <Button
          type="submit"
          variant="success"
          loading={api.loading}
          className="w-full"
        >
          Publish Post
        </Button>
      </form>
      <Toast message={message} setMessage={setMessage} loading={api.loading} />
    </PageContainer>
  </AuthGuard>
  );
}