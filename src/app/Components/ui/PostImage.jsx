import Image from "next/image";
import { isValidImageUrl } from '@/lib/utils';

const PostImage = ({ src, alt, className = "", sizes, priority = false }) => {
  return isValidImageUrl(src) ? (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${className}`}
      priority={priority}
    />
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-400 text-sm">No Image</span>
    </div>
  );
};

export default PostImage;