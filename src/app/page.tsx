'use client';

import { Wizard } from './components/wizard/Wizard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-20">
      <header className="text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter">
            Help Me Pick
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Find the best product for you — fast, easy, and personalized!
          </p>
        </motion.div>
      </header>
      <Wizard />
    </div>
  );
}
