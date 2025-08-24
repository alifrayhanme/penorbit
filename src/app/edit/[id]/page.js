"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/Components/ui/Input";
import TextArea from "@/app/Components/ui/TextArea";
import Button from "@/app/Components/ui/Button";
import FormField from "@/app/Components/ui/FormField";
import Toast from "@/app/Components/ui/Toast";
import AuthGuard from "@/app/Components/ui/AuthGuard";
import PageContainer from "@/app/Components/ui/PageContainer";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import { useAuth } from '@/hooks/useAuth';
import { useMessage } from '@/hooks/useMessage';
import { useApi } from '@/hooks/useApi';
import { isValidImageUrl } from '@/lib/utils';

export default function EditPost({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    bannerImage: "",
    category: "",
    summary: "",
    details: ""
  });
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState(null);
  const { message, setMessage, showSuccess, showError } = useMessage();
  const api = useApi();

  useEffect(() => {
    const getPostId = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    };
    getPostId();
  }, [params]);

  useEffect(() => {
    if (!user || !postId) return;

    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const post = await response.json();
        if (post.authorId.toString() !== user.id.toString()) {
          showError("Unauthorized to edit this post");
          router.push("/profile");
          return;
        }
        setFormData({
          title: post.title || "",
          bannerImage: post.bannerImage || "",
          category: post.category || "",
          summary: post.summary || "",
          details: post.details || ""
        });
      } else {
        showError("Post not found");
        router.push("/profile");
      }
      setLoading(false);
    };

    fetchPost();
  }, [user, postId]);

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

    const result = await api.patch(`/api/posts/${postId}`, {
      ...formData,
      userId: user.id
    });

    if (result.success) {
      showSuccess("Post updated successfully");
      router.push("/profile");
    } else {
      showError(result.error);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <PageContainer>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageContainer className="bg-white">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Edit Post
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

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="success"
              loading={api.loading}
              className="flex-1"
            >
              Update Post
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/profile")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
        <Toast message={message} setMessage={setMessage} loading={api.loading} />
      </PageContainer>
    </AuthGuard>
  );
}