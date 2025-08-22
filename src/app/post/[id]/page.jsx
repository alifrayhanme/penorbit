"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import Banner from "../../Components/post/Banner";
import CategoryDate from "../../Components/post/CategoryDate";
import Title from "../../Components/post/Title";
import AuthorProfile from "../../Components/AuthorProfile";

const PostPage = ({ params }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [postId, setPostId] = useState(null);
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          // Get user reaction
          if (user && data.userReactions) {
            setUserReaction(data.userReactions[user.id] || null);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, user]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!post) return (
    <div className="text-center py-10">
      <p className="mb-4">Post not found.</p>
      <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
        Go Home
      </Link>
    </div>
  );

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPost(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
        setUserReaction(data.userReaction);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/posts/${postId}/dislike`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPost(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
        setUserReaction(data.userReaction);
      }
    } catch (error) {
      console.error("Failed to dislike post:", error);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    if (!user) {
      alert("Please sign in to comment");
      return;
    }
    
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText.trim(),
          userId: parseInt(user.id)
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost(prev => ({ ...prev, comments: data.comments }));
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };



  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <Title title={post.title} css="mt-5" />
      <div className="border-t-0 mb-2.5 py-3">
        <AuthorProfile author={post.author} size="lg" showEmail={false} />
      </div>
      <Banner src={post.bannerImage || "/blogbannerimage.jpg"} alt="blog banner" />
      <CategoryDate category={post.category || "General"} date={new Date(post.createdAt).toLocaleDateString()} />

      <div className="prose prose-lg max-w-none text-gray-700 mt-6">
        <p>{post.summary}</p>
        <p>{post.details}</p>
      </div>



      <div className="my-8 flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              userReaction === 'like' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
            }`}
          >
            <FaThumbsUp /> {post.likes || 0}
          </button>
          <button 
            onClick={handleDislike} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              userReaction === 'dislike' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 hover:bg-red-100 text-gray-700'
            }`}
          >
            <FaThumbsDown /> {post.dislikes || 0}
          </button>
        </div>

        <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder={user ? "Write a comment..." : "Sign in to comment"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
            disabled={!user}
          />
          <button onClick={handleAddComment} className="text-blue-600">
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {post.comments && post.comments.length > 0 ? (
          post.comments
            .filter(c => c && c.status !== 'suspended')
            .map((c, index) => (
              <div key={`comment-${postId}-${c.id || index}-${c.createdAt || Date.now()}`} className="bg-gray-100 p-3 rounded-md">
                <p className="font-semibold text-blue-600">{c.user || 'Anonymous'}:</p>
                <p className="mt-1 text-gray-700">{c.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <div className="border-t pt-4 border-gray-300 mt-8">
        <p className="font-bold text-gray-600 text-lg mb-2">Share</p>
        <div className="flex gap-3">
          <Link href="/" className="text-2xl"><FaFacebookF /></Link>
          <Link href="/" className="text-2xl"><FaInstagram /></Link>
          <Link href="/" className="text-2xl"><FaTwitter /></Link>
        </div>
      </div>
    </div>
  );
};

export default PostPage;