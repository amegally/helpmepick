const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto bg-gray-100 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          <p className="mb-2">Copyright 2025 - Help Me Pick</p>
          <p>
            Built with AI Using the Course{' '}
            <a 
              href="http://unlockvibecoding.com/"
              className="text-black font-bold hover:text-black-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock Vibe Coding - Learn to Build Your Own Apps
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 