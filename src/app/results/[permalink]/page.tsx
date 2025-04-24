import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';

interface ProductRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  amazonUrl: string;
}

interface PageProps {
  params: {
    permalink: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const revalidate = 3600; // Revalidate every hour

async function getResult(permalink: string) {
  const result = await prisma.wizardResult.findUnique({
    where: { permalink },
  });

  if (!result) {
    notFound();
  }

  return result;
}

export default async function ResultsPage({ params }: PageProps) {
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
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-gray-700 mb-3">{product.explanation}</p>
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