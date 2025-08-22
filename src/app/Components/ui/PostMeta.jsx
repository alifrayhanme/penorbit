import { formatDate } from '@/lib/utils';

const PostMeta = ({ author, date, className = "", textSize = "text-sm" }) => (
  <div className={`flex items-center ${textSize} text-gray-300 ${className}`}>
    <span>{author?.name || 'Anonymous'}</span>
    <span className="mx-2">•</span>
    <span>{formatDate(date)}</span>
  </div>
);

export default PostMeta;