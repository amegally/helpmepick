'use client';

import { useState, useEffect } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';

export function CriteriaStep() {
  const { state, setCriteria, setRecommendations, nextStep, previousStep } = useWizard();
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await fetch('/api/wizard/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: state.category }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }

        const data = await response.json();
        setQuestion(data.question);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [state.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    try {
      // First save the criteria
      setCriteria(answer.trim());

      // Then fetch recommendations
      const response = await fetch('/api/wizard/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: state.category,
          criteria: answer.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      nextStep();
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Analyzing your request...
          </h2>
          <p className="text-gray-600">
            We're preparing a follow-up question to better understand your needs.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={previousStep}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Let's get more specific
        </h2>
        <p className="text-gray-600">
          {question}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="criteria" className="sr-only">
            Your Answer
          </label>
          <textarea
            id="criteria"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tell us more about your needs..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors min-h-[120px]"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={previousStep}
            disabled={submitting}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Getting Recommendations...
              </span>
            ) : (
              'Next Step'
            )}
          </button>
        </div>
      </form>

      <div className="text-sm text-gray-500">
        <p>Your category: <span className="font-medium text-gray-900">{state.category}</span></p>
      </div>
    </div>
  );
} 