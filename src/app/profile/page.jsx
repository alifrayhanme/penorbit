"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/Components/ui/Button";
import Card from "@/app/Components/ui/Card";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import Alert from "@/app/Components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { formatDate, generateInitials } from "@/lib/utils";


export default function Profile() {
  const { user, updateUser } = useAuth();
  const { data: allPosts, loading, refetch } = useFetch("/api/posts");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    profession: "",
    profilePic: "",
  });
  const userPosts = (allPosts || []).filter((post) => {
    if (!user?.id || !post?.authorId) return false;
    return post.authorId.toString() === user.id.toString();
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        profession: user.profession || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        setMessage("Post deleted successfully");
        refetch();
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to delete post");
      }
    } catch (error) {
      setMessage("Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendPost = async (postId) => {
    if (!confirm("Are you sure you want to suspend/unsuspend this post?"))
      return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: user.role === "admin" ? user.email : null,
        }),
      });

      if (response.ok) {
        setMessage("Post status updated successfully");
        refetch();
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to update post status");
      }
    } catch (error) {
      setMessage("Failed to update post status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...profileData }),
      });

      if (response.ok) {
        const result = await response.json();
        updateUser(result.user);
        setMessage("Profile updated successfully");
        setIsEditing(false);
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user.name || "",
      profession: user.profession || "",
      profilePic: user.profilePic || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert type="error" className="mb-4">
            Please sign in to view your profile
          </Alert>
          <Button as={Link} href="/auth/signin">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleProfileUpdate}>Save</Button>
              <Button onClick={handleCancelEdit} className="bg-red-600">
                Cancel
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-shrink-0">
            {(isEditing ? profileData.profilePic : user.profilePic) ? (
              <img
                src={isEditing ? profileData.profilePic : user.profilePic}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {generateInitials(user.name)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold">{user.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.profession}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        profession: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your profession"
                  />
                ) : (
                  <p className="text-lg">
                    {user.profession || "Not specified"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <p className="text-lg capitalize">{user.role}</p>
              </div>
              {isEditing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={profileData.profilePic}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        profilePic: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>


      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        {message && (
          <Alert
            type={
              message.includes("success") || message.includes("deleted")
                ? "success"
                : "error"
            }
            className="mb-4 shadow-lg rounded-lg"
          >
            {message}
          </Alert>
        )}
      </div>

      <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 z-50">
        {actionLoading && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-blue-700">Processing...</span>
            </div>
          </div>
        )}
      </div>


      <Card className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2.5">
          <h2 className="text-2xl font-bold">My Posts ({userPosts.length})</h2>
          <div className="flex gap-2">
            <Button
              as={Link}
              href="/post?user=me"
              size="sm"
              variant="secondary"
            >
              View All My Posts
            </Button>
            <Button as={Link} href="/createblog" size="sm" variant="success">
              Create New Post
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You haven't created any posts yet.
            </p>
            <Button as={Link} href="/createblog">
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <Card key={post.id} hover className="p-4 border">
                <div className="flex flex-wrap justify-between items-start gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      {post.status === "suspended" && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{post.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.likes || 0} likes</span>
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-2">
                    <Button as={Link} href={`/post/${post.id}`} size="sm">
                      View
                    </Button>
                    {user.role === "admin" && (
                      <Button
                        onClick={() => handleSuspendPost(post.id)}
                        size="sm"
                        variant="warning"
                        disabled={actionLoading}
                        className="flex items-center gap-1"
                      >
                        {post.status === "suspended" ? "Unsuspend" : "Suspend"}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeletePost(post.id)}
                      size="sm"
                      variant="danger"
                      disabled={actionLoading}
                      className="flex items-center gap-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
