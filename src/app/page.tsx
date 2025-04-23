'use client';

import { Wizard } from './components/wizard/Wizard';

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Help Me Pick
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized product recommendations through an interactive experience powered by AI.
        </p>
      </header>
      <Wizard />
    </div>
  );
}
