'use client';

import { Wizard } from './components/wizard/Wizard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="text-center space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 sm:space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter">
            Help Me Pick
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find the best product for you — fast, easy, and personalized!
          </p>
        </motion.div>
      </header>
      <Wizard />
    </div>
  );
}
