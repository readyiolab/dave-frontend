import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center border-t border-gray-600 h-16 flex-shrink-0 flex items-center justify-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Freedom Mergers. All rights reserved.
      </p>
    </footer>
  );
}