export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/posts/${id}`);
    if (res.ok) {
      const post = await res.json();
      return {
        title: `${post.title} | PenOrbit`,
        description: post.summary,
        keywords: `blog, ${post.category}, ${post.title}`,
        openGraph: {
          title: post.title,
          description: post.summary,
          images: [post.bannerImage || '/blogbannerimage.jpg'],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Post | PenOrbit',
    description: 'Read blog posts on PenOrbit',
  };
}

export default function PostLayout({ children }) {
  return children;
}