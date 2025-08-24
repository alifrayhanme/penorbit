"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/Components/ui/Button";
import Card from "@/app/Components/ui/Card";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import Alert from "@/app/Components/ui/Alert";
import Toast from "@/app/Components/ui/Toast";
import Input from "@/app/Components/ui/Input";

import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { formatDate, isAdmin } from "@/lib/utils";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: posts = [], refetch: refetchPosts } = useFetch('/api/posts');
  const { data: users = [], refetch: refetchUsers } = useFetch('/api/users');
  const { data: newsletterData = {}, refetch: refetchNewsletter } = useFetch('/api/newsletter');
  const { data: contacts = [], refetch: refetchContacts } = useFetch('/api/contact');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', profession: '', role: '' });
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' });
  
  const subscribers = newsletterData?.subscribers || [];

  useEffect(() => {
    if (posts && users && newsletterData && contacts) {
      setLoading(false);
    }
  }, [posts, users, newsletterData, contacts]);

  const handleUserStatusChange = async (userId, newStatus) => {
    if (!userId) {
      setMessage("Invalid user ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminEmail: user?.email })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(`User ${newStatus} successfully`);
        await refetchUsers();
      } else {
        setMessage(data.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      setMessage("Invalid user ID");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("User deleted successfully");
        await refetchUsers();
      } else {
        setMessage(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      profession: user.profession || '',
      role: user.role || 'user'
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: editingUser._id || editingUser.id,
          ...editForm,
          adminEmail: user?.email
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("User updated successfully");
        setEditingUser(null);
        await refetchUsers();
      } else {
        setMessage(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', profession: '', role: '' });
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      setMessage('All fields are required');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...createForm,
          adminEmail: user?.email
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('User created successfully');
        setShowCreateUser(false);
        setCreateForm({ name: '', email: '', password: '', role: 'user' });
        await refetchUsers();
      } else {
        setMessage(data.error || 'Failed to create user');
      }
    } catch (error) {
      setMessage('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateUser(false);
    setCreateForm({ name: '', email: '', password: '', role: 'user' });
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, commentId })
      });

      if (res.ok) {
        setMessage("Comment deleted successfully");
        await refetchPosts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setMessage("Error deleting comment");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendComment = async (postId, commentId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, commentId })
      });

      if (res.ok) {
        setMessage("Comment status updated");
        await refetchPosts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setMessage("Error updating comment");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContactStatus = async (contactId, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminEmail: user?.email })
      });

      if (res.ok) {
        setMessage(`Message marked as ${newStatus}`);
        refetchContacts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update message status");
      }
    } catch (error) {
      setMessage("Error updating message");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${contactId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email })
      });

      if (res.ok) {
        setMessage("Message deleted successfully");
        refetchContacts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete message");
      }
    } catch (error) {
      setMessage("Error deleting message");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter/${subscriberId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email })
      });

      if (res.ok) {
        setMessage("Subscriber deleted successfully");
        refetchNewsletter();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete subscriber");
      }
    } catch (error) {
      setMessage("Error deleting subscriber");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendPost = async (postId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email })
      });

      if (res.ok) {
        setMessage("Post status updated successfully");
        await refetchPosts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update post status");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user?.email })
      });

      if (res.ok) {
        setMessage("Post deleted successfully");
        await refetchPosts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage("Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert type="error" className="mb-4">
            Please sign in to access admin dashboard
          </Alert>
          <Button as={Link} href="/auth/signin">Sign In</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <Alert type="error" className="mb-4">
            You don't have admin privileges. Current role: {user.role}
          </Alert>
          <Button as={Link} href="/">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        
        <div className="flex flex-wrap gap-4  mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'posts', label: 'Posts' },
            { id: 'comments', label: 'Comments' },
            { id: 'newsletter', label: 'Newsletter' },
            { id: 'contacts', label: `Messages ${contacts && contacts.filter(c => c?.status === 'unread').length > 0 ? `(${contacts.filter(c => c?.status === 'unread').length})` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: 'Total Users', value: users?.length || 0, color: 'blue' },
              { title: 'Total Posts', value: posts?.length || 0, color: 'green' },
              { title: 'Total Comments', value: posts?.reduce((total, post) => total + (post.comments?.length || 0), 0) || 0, color: 'purple' },
              { title: 'Newsletter Subscribers', value: subscribers?.length || 0, color: 'orange' },
            ].map((stat, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-800',
                green: 'bg-green-100 text-green-800',
                purple: 'bg-purple-100 text-purple-800',
                orange: 'bg-orange-100 text-orange-800',
              };
              return (
                <div key={`stat-${stat.title}-${index}`} className={`${colorClasses[stat.color].split(' ')[0]} p-4 rounded-lg`}>
                  <h3 className={`font-semibold ${colorClasses[stat.color].split(' ')[1]}`}>
                    {stat.title}
                  </h3>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button
                onClick={() => setShowCreateUser(true)}
                disabled={loading}
              >
                Create User
              </Button>
            </div>
            
            {!users || users.length === 0 ? (
              <p className="text-gray-600">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((u, index) => (
                      <tr key={u.id || u._id || `user-${index}`} className="border-t">
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {u.email !== 'admin@penorbit.com' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleEditUser(u)}
                                disabled={loading}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant={u.status === 'active' ? 'danger' : 'success'}
                                onClick={() => handleUserStatusChange(u.id || u._id, u.status === 'active' ? 'suspended' : 'active')}
                                disabled={loading}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDeleteUser(u.id || u._id)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">Admin (Protected)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {!loading && activeTab === 'comments' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Comment Management</h2>
            
            <div className="space-y-6">
              {posts && posts.length > 0 ? (
                posts
                  .filter(post => post.comments && post.comments.length > 0)
                  .map((post) => (
                    <div key={`post-${post._id}`} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">
                        Comments on: <Link href={`/post/${post._id}`} className="text-blue-600 hover:underline">{post.title}</Link>
                      </h3>
                      <div className="space-y-2">
                        {post.comments
                          .filter(comment => comment && comment.id)
                          .map((comment) => (
                            <div key={`comment-${post._id}-${comment.id}`} className={`p-3 rounded border-l-4 ${
                              comment.status === 'suspended' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                            }`}>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">{comment.user || 'Anonymous'}</p>
                                  <p className="text-gray-700 mt-1">{comment.text}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {comment.createdAt ? formatDate(comment.createdAt) : 'Unknown date'} - 
                                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                      comment.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {comment.status || 'active'}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant={comment.status === 'suspended' ? 'success' : 'danger'}
                                    onClick={() => handleSuspendComment(post._id, comment.id)}
                                    disabled={loading}
                                  >
                                    {comment.status === 'suspended' ? 'Activate' : 'Suspend'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteComment(post._id, comment.id)}
                                    disabled={loading}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
              ) : null}
              {!posts || posts.length === 0 || posts.every(post => !post.comments || post.comments.length === 0) ? (
                <p className="text-gray-600">No comments found.</p>
              ) : null}
            </div>
          </Card>
        )}

        {!loading && activeTab === 'newsletter' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Newsletter Subscribers ({subscribers.length})</h2>
            
            {!subscribers || subscribers.length === 0 ? (
              <p className="text-gray-600">No subscribers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Subscribed Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers && subscribers.map((subscriber, index) => (
                      <tr key={subscriber._id || `subscriber-${index}`} className="border-t">
                        <td className="px-4 py-2">{subscriber.email}</td>
                        <td className="px-4 py-2">{formatDate(subscriber.subscribedAt)}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteSubscriber(subscriber._id || subscriber.id)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {!loading && activeTab === 'contacts' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Messages ({contacts.length})</h2>
            
            {!contacts || contacts.length === 0 ? (
              <p className="text-gray-600">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {contacts && contacts.map((contact) => (
                  <div key={contact._id} className={`border rounded-lg p-4 ${
                    contact.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{contact.subject}</h3>
                        <p className="text-sm text-gray-600">
                          From: <strong>{contact.name}</strong> ({contact.email})
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        contact.status === 'unread' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant={contact.status === 'unread' ? 'success' : 'primary'}
                        onClick={() => handleUpdateContactStatus(contact._id, contact.status === 'unread' ? 'read' : 'unread')}
                        disabled={loading}
                      >
                        Mark as {contact.status === 'unread' ? 'Read' : 'Unread'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteContact(contact._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        as="a"
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      >
                        Reply via Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {!loading && activeTab === 'posts' && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Post Management</h2>
            
            {!posts || posts.length === 0 ? (
              <p className="text-gray-600">No posts found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Author</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Likes</th>
                      <th className="px-4 py-2 text-left">Comments</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts && posts.map((post) => (
                      <tr key={post._id} className="border-t">
                        <td className="px-4 py-2">
                          <Link href={`/post/${post._id}`} className="text-blue-600 hover:underline">
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{post.author?.name || "Unknown"}</td>
                        <td className="px-4 py-2">{formatDate(post.createdAt)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            post.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {post.status || 'active'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{post.likes || 0}</td>
                        <td className="px-4 py-2">{post.comments?.length || 0}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={post.status === 'suspended' ? 'success' : 'danger'}
                              onClick={() => handleSuspendPost(post._id)}
                              disabled={loading}
                            >
                              {post.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeletePost(post._id)}
                              disabled={loading}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
      
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="User name"
              />
              <Input
                label="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="User email"
                type="email"
              />
              <Input
                label="Profession"
                value={editForm.profession}
                onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                placeholder="User profession"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleUpdateUser}
                disabled={loading}
                className="flex-1"
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={createForm.name}
                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                placeholder="User name"
              />
              <Input
                label="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                placeholder="User email"
                type="email"
              />
              <Input
                label="Password"
                value={createForm.password}
                onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                placeholder="User password"
                type="password"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateUser}
                disabled={loading}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelCreate}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Toast message={message} setMessage={setMessage} loading={loading} />
    </div>
  );
}