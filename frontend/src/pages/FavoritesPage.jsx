import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FavoritesPage = () => {
  const { user } = useAuth();
  const { properties } = useProperties();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // In a real app, you would fetch favorites from a separate collection
        // For now, we'll show featured properties as demo favorites
        const featuredProperties = properties.filter(p => p.featured && p.status === 'available');

        setFavorites(featuredProperties);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    if (properties.length > 0) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [properties]);

  const removeFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(p => p.id !== propertyId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Favorite Properties</h1>
        <p className="mt-2 text-gray-600">
          Properties you've saved for later
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 text-center"
        >
          <div className="p-8 bg-white rounded-lg shadow-sm">
            <HeartIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="text-gray-600">
              Start browsing properties and save your favorites here
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard 
                property={property} 
                onFavorite={removeFavorite}
                isFavorited={true}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;