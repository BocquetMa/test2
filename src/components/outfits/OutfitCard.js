import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation simple
    if (!username.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Tentative de connexion avec:', username);
      const userData = await login(username, password);
      console.log('Connexion réussie, données reçues:', userData);
      
      // Vérifier que les données utilisateur contiennent un ID
      if (!userData || !userData.id) {
        console.error('Données utilisateur invalides:', userData);
        toast.error('Erreur de connexion: données utilisateur incomplètes');
        setLoading(false);
        return;
      }
      
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Gestion améliorée des erreurs
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        const errorMessage = error.response.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.';
        toast.error(errorMessage);
      } else if (error.request) {
        // Pas de réponse du serveur
        toast.error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      } else {
        // Erreur lors de la préparation de la requête
        toast.error('Erreur lors de la connexion: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            créez un nouveau compte
          </Link>
        </p>
      </div>

      {/* Le reste de votre JSX reste inchangé */}
      {/* ... */}
    </div>
  );
};

export default LoginPage;