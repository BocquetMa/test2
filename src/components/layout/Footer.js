import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white">FitAI</h3>
            <p className="mt-4 text-base text-gray-300">
              L'assistant intelligent pour choisir vos vêtements selon votre morphologie, la météo et votre style préféré.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-base text-gray-300 hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="text-base text-gray-300 hover:text-white">
                  Garde-robe
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <p className="mt-4 text-base text-gray-300">
              Une question? N'hésitez pas à nous contacter.
            </p>
            <p className="mt-2 text-base text-gray-300">
              Email: contact@fitai.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} FitAI. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;