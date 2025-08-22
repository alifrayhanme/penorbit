import Image from "next/image";
import { isValidImageUrl } from '@/lib/utils';

const Banner = ({ src, alt }) => {
  if (!isValidImageUrl(src)) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-200 flex items-center justify-center mb-6 rounded-lg">
        <span className="text-gray-500 text-lg">No Image Available</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[16/9] relative mb-6">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </div>
  );
};

export default Banner;
