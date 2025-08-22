import Link from "next/link";
import PageContainer from "@/app/Components/ui/PageContainer";

export default function About() {
  return (
    <PageContainer maxWidth="max-w-4xl" padding="px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About PenOrbit</h1>
        <p className="text-xl text-gray-600">
          Your space to share stories, insights, and connect with readers worldwide
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            PenOrbit is a modern blogging platform designed to empower writers and content creators. 
            We believe everyone has a story to tell, and we provide the tools and community to help 
            you share your voice with the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">For Writers</h3>
            <p className="text-gray-700">
              Create beautiful posts with our intuitive editor. Share your expertise, 
              experiences, and creativity with a global audience.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">For Readers</h3>
            <p className="text-gray-700">
              Discover amazing content across various topics. Engage with authors 
              through comments and build meaningful connections.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Why Choose PenOrbit?</h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Clean, distraction-free writing environment</li>
            <li>• Responsive design that works on all devices</li>
            <li>• Engage with readers through comments and reactions</li>
            <li>• Professional author profiles</li>
            <li>• Easy content management</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link 
          href="/createblog" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Writing Today
        </Link>
      </div>
    </PageContainer>
  );
}