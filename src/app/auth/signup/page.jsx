"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Input from "@/app/Components/ui/Input";
import Button from "@/app/Components/ui/Button";
import Alert from "@/app/Components/ui/Alert";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError("Valid email is required");
      setLoading(false);
      return;
    }

    if (!formData.profession.trim()) {
      setError("Profession is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! Signing you in...");
        
        // Wait a moment before auto sign in
        setTimeout(async () => {
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
          });
          
          if (result?.error) {
            setError("Account created but auto sign-in failed. Please sign in manually.");
            setTimeout(() => router.push("/auth/signin"), 2000);
          } else {
            setSuccess("Welcome! Redirecting to your profile...");
            setTimeout(() => router.push("/profile"), 1000);
          }
        }, 1000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}
          
          <Input
            type="text"
            required
            disabled={loading}
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="Full name"
          />
          
          <Input
            type="email"
            required
            disabled={loading}
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Email address"
          />
          
          <Input
            type="text"
            required
            disabled={loading}
            value={formData.profession}
            onChange={handleChange('profession')}
            placeholder="Profession (e.g., Developer, Writer, Designer)"
          />
          
          <Input
            type="url"
            disabled={loading}
            value={formData.profilePic}
            onChange={handleChange('profilePic')}
            placeholder="Profile Picture URL (Optional)"
          />
          
          <Input
            type="password"
            required
            disabled={loading}
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Password (minimum 6 characters)"
            minLength="6"
          />
          
          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign up
          </Button>
          <div className="text-center">
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}