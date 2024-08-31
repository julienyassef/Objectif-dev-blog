import Link from 'next/link';
import Image from 'next/image';
import DateRelative from '@/components/DateRelative/DateRelative';
import ShareButton from '@/components/Buttons/ShareButton/ShareButton';

interface ArticleCardProps {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishDate: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ slug, title, summary, imageUrl, publishDate }) => {
  return (
    <div className="flex flex-col transform transition-transform duration-300 hover:scale-95 mb-5">
      <Link href={`/blog/${slug}`} className="group flex-grow">
        <div className="w-full h-40 border border-gray-400">
          <Image 
            src={imageUrl} 
            alt={title} 
            width={600}
            height={400}
            objectFit="cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-1 pt-4 flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-2xl mb-3 text-black font-bold text-justify">{title}</h2>
            <p className="text-bold text-gray-600 font-medium text-justify">
              {summary.length > 150 ? `${summary.slice(0, 150)}...` : summary}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          <DateRelative date={publishDate} />
        </p>
        <ShareButton slug={slug} title={title}/>
      </div>
    </div>
  );
};

export default ArticleCard;
