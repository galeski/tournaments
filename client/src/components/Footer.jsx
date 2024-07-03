import React from 'react';

const Footer = () => {
  const version = '1.0.0'; // You can update this manually or use environment variables

  return (
    <footer className="bg-gray-100 text-center p-4 mt-8">
      <div className="container mx-auto">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Your App Name. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Version: {version}
        </p>
      </div>
    </footer>
  );
};

export default Footer;