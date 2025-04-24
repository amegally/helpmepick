'use client';

import React, { useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';
import { ProductRecommendation } from '@/types/wizard';
import { generateAmazonAffiliateUrl } from '@/lib/api/amazon';

export function RecommendationsStep() {
  const { state, setRecommendations, nextStep, previousStep } = useWizard();
  const [copied, setCopied] = useState(false);
  const [permalink, setPermalink] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveAndCopyLink = async () => {
    if (permalink) {
      // If we already have a permalink, just copy it
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
      // Show error message to user
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Here are your recommendations
        </h2>
        <p className="text-gray-600">
          Based on your preferences, we think these would be perfect for you.
        </p>
      </div>

      <div className="grid gap-6">
        {state.recommendations.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
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

      <div className="flex gap-3">
        <button
          onClick={handleSaveAndCopyLink}
          disabled={saving}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium relative disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : copied ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Copied!
            </motion.span>
          ) : (
            'Copy Share Link'
          )}
        </button>
        <button
          onClick={previousStep}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
} 