'use client';

import React, { useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';

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

export function RecommendationsStep() {
  const { state, previousStep, setCriteria, setRecommendations } = useWizard();
  const [copied, setCopied] = useState(false);
  const [permalink, setPermalink] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showClarificationForm, setShowClarificationForm] = useState(false);
  const [additionalCriteria, setAdditionalCriteria] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleSaveAndCopyLink = async () => {
    if (permalink) {
      await copyToClipboard(`${window.location.origin}/results/${permalink}`);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/wizard/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: state.category,
          criteria: state.criteria,
          recommendations: state.recommendations,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save results');
      }

      const { permalink: newPermalink } = await response.json();
      setPermalink(newPermalink);
      await copyToClipboard(`${window.location.origin}/results/${newPermalink}`);
    } catch (err) {
      console.error('Error saving results:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClarification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalCriteria.trim()) return;

    setIsRefining(true);
    try {
      const response = await fetch('/api/wizard/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: state.category,
          criteria: `${state.criteria}\nAdditional criteria: ${additionalCriteria}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get refined recommendations');
      }

      const data = await response.json();
      setCriteria(`${state.criteria}\nAdditional criteria: ${additionalCriteria}`);
      setRecommendations(data.recommendations);
      setShowClarificationForm(false);
      setAdditionalCriteria('');
    } catch (err) {
      console.error('Error refining recommendations:', err);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
          Here are your top recommendations
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Based on your preferences, we think these would be perfect for you.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {state.recommendations.slice(0, 3).map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <StarRating rating={product.rating} />
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
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

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                View on Amazon
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        {!showClarificationForm ? (
          <button
            onClick={() => setShowClarificationForm(true)}
            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Want more specific recommendations? Click here to refine your criteria
          </button>
        ) : (
          <form onSubmit={handleClarification} className="space-y-4">
            <div>
              <label htmlFor="additionalCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                What additional details would help us find better recommendations?
              </label>
              <textarea
                id="additionalCriteria"
                value={additionalCriteria}
                onChange={(e) => setAdditionalCriteria(e.target.value)}
                placeholder="e.g., I prefer products with longer battery life, or I need something more compact..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors min-h-[100px]"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClarificationForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefining}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRefining ? 'Refining...' : 'Get Refined Results'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={previousStep}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSaveAndCopyLink}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : copied ? 'Copied!' : 'Share Results'}
        </button>
      </div>
    </div>
  );
} 