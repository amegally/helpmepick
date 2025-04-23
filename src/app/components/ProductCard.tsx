import Image from 'next/image';
import { ProductRecommendation } from '@/types/wizard';
import { motion } from 'framer-motion';
import { generateAmazonAffiliateUrl } from '@/lib/api/amazon';

interface ProductCardProps {
  product: ProductRecommendation;
}

export function ProductCard({ product }: ProductCardProps) {
  const amazonUrl = generateAmazonAffiliateUrl(product.name);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {product.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="space-y-2">
          {product.features?.map((feature, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        {product.price && (
          <div className="mt-4 text-lg font-bold text-gray-900">
            ${product.price}
          </div>
        )}
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full bg-[#FF9900] hover:bg-[#FF8C00] text-white font-bold py-2 px-4 rounded text-center transition-colors duration-300"
        >
          Search on Amazon
        </a>
      </div>
    </motion.div>
  );
} 