import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Metadata } from 'next';

interface ProductRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  amazonUrl: string;
  personalNote: string;
  rating: number;
}

interface PageProps {
  params: {
    permalink: string;
  };
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) {
          // Full star
          return (
            <svg key={index} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        } else if (index === fullStars && hasHalfStar) {
          // Half star
          return (
            <div key={index} className="relative w-4 h-4">
              {/* Empty star background */}
              <svg className="absolute w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {/* Half star overlay */}
              <div className="absolute w-2 h-4 overflow-hidden">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        } else {
          // Empty star
          return (
            <svg key={index} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
      })}
      <span className="ml-1 text-sm text-gray-500">({rating})</span>
    </div>
  );
};

// Define metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getResult(params.permalink);
  return {
    title: `Product Recommendations - ${result.category}`,
    description: `Personalized product recommendations for ${result.category} based on your criteria.`,
  };
}

export const revalidate = 3600; // Revalidate every hour

async function getResult(permalink: string) {
  const result = await prisma.wizardResult.findUnique({
    where: { permalink },
  });

  if (!result) {
    notFound();
  }

  // Cast the recommendations JSON to the correct type
  const recommendations = result.recommendations as unknown as ProductRecommendation[];
  return {
    ...result,
    recommendations
  };
}

export default async function ResultsPage({
  params,
}: {
  params: { permalink: string };
}) {
  const result = await getResult(params.permalink);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Recommendations</h1>
        <p className="text-gray-600">
          Here are personalized product recommendations based on the following criteria
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <p className="text-gray-700">{result.category}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Criteria</h2>
            <p className="text-gray-700">{result.criteria}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
            <div className="grid gap-4">
              {(result.recommendations as ProductRecommendation[]).map((product, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <StarRating rating={product.rating} />
                  </div>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  
                  {/* Personal Note Sticky */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          {product.personalNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{product.price}</span>
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                    >
                      View on Amazon
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Create Your Own Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
} 