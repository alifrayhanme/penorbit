"use client";

import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Alert from "./ui/Alert";
import { validateEmail } from '@/lib/utils';

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setEmail("");
      } else {
        setMessage(data.error);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="space-y-5 bg-gray-100 p-10">
        <h2 className="text-xl font-bold">Subscribe to newsletter</h2>
        
        {message && (
          <Alert type={isSuccess ? 'success' : 'error'} className="text-center">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 justify-between items-center gap-10">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl  outline-none "
          />
          <Button 
            type="submit"
            loading={loading}
            className="bg-orange-400 text-orange-50 hover:bg-orange-50 hover:text-orange-400 shadow-2xl border border-orange-400 w-full  rounded-full outline-none"
          >
            SUBSCRIBE
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;