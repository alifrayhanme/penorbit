"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/Components/ui/Button";
import Card from "@/app/Components/ui/Card";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import Toast from "@/app/Components/ui/Toast";
import AuthGuard from "@/app/Components/ui/AuthGuard";
import PageContainer from "@/app/Components/ui/PageContainer";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { useMessage } from "@/hooks/useMessage";
import { useApi } from "@/hooks/useApi";
import { formatDate, generateInitials } from "@/lib/utils";


export default function Profile() {
  const { user, updateUser } = useAuth();
  const { data: allPosts, loading, refetch } = useFetch("/api/posts");
  const { message, setMessage, showSuccess, showError } = useMessage();
  const api = useApi();
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

    const result = await api.del(`/api/posts/${postId}`, { userId: user.id });
    if (result.success) {
      showSuccess("Post deleted");
      refetch();
    } else {
      showError(result.error);
    }
  };

  const handleSuspendPost = async (postId) => {
    if (!confirm("Are you sure you want to suspend/unsuspend this post?"))
      return;

    const result = await api.put(`/api/posts/${postId}`, {
      adminEmail: user.role === "admin" ? user.email : null,
    });
    if (result.success) {
      showSuccess("Post status updated");
      refetch();
    } else {
      showError(result.error);
    }
  };

  const handleProfileUpdate = async () => {
    const result = await api.put("/api/users/profile", { userId: user.id, ...profileData });
    if (result.success) {
      updateUser(result.data.user);
      showSuccess("Profile updated");
      setIsEditing(false);
    } else {
      showError(result.error);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      profession: user?.profession || "",
      profilePic: user?.profilePic || "",
    });
    setIsEditing(false);
  };



  return (
    <AuthGuard>
      <PageContainer>
        <Card className="sm:p-6 mb-8">
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
            {(isEditing ? profileData.profilePic : user?.profilePic) ? (
              <img
                src={isEditing ? profileData.profilePic : user?.profilePic}
                alt={user?.name || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {generateInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 sm:mb-2">
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
                  <p className="text-lg font-semibold">{user?.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 sm:mb-2">
                  Email
                </label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 sm:mb-2">
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
                    {user?.profession || "Not specified"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 sm:mb-2">
                  Role
                </label>
                <p className="text-lg capitalize">{user?.role}</p>
              </div>
              {isEditing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 sm:mb-2">
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
              <Card key={post._id} hover className="p-4 border">
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
                    <Button as={Link} href={`/post/${post._id}`} size="sm">
                      View
                    </Button>
                    <Button as={Link} href={`/edit/${post._id}`} size="sm" variant="secondary">
                      Edit
                    </Button>
                    {user?.role === "admin" && (
                      <Button
                        onClick={() => handleSuspendPost(post._id)}
                        size="sm"
                        variant="warning"
                        disabled={api.loading}
                        className="flex items-center gap-1"
                      >
                        {post.status === "suspended" ? "Unsuspend" : "Suspend"}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeletePost(post._id)}
                      size="sm"
                      variant="danger"
                      disabled={api.loading}
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
        <Toast message={message} setMessage={setMessage} loading={api.loading} />
      </PageContainer>
    </AuthGuard>
  );
}
