import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const SearchPanel = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    type: '',
    priceRange: ''
  });
  
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.type) params.append('type', searchData.type);
    if (searchData.priceRange) params.append('priceRange', searchData.priceRange);
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20"
    >
      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative">
          <MapPinIcon className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
          <input
            id="search-location"
            name="search-location"
            type="text"
            placeholder="Location"
            value={searchData.location}
            onChange={(e) => setSearchData({...searchData, location: e.target.value})}
            className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-300 border rounded-lg border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        
        <select
          id="search-type"
          name="search-type"
          value={searchData.type}
          onChange={(e) => setSearchData({...searchData, type: e.target.value})}
          className="w-full px-4 py-3 text-white border rounded-lg border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          <option key="" value="">Property Type</option>
          <option key="house" value="house">House</option>
          <option key="apartment" value="apartment">Apartment</option>
          <option key="condo" value="condo">Condo</option>
          <option key="villa" value="villa">Villa</option>
        </select>
        
        <select
          id="search-price-range"
          name="search-price-range"
          value={searchData.priceRange}
          onChange={(e) => setSearchData({...searchData, priceRange: e.target.value})}
          className="w-full px-4 py-3 text-white border rounded-lg border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          <option key="" value="">Price Range</option>
          <option key="0-500000" value="0-500000">Under $500K</option>
          <option key="500000-1000000" value="500000-1000000">$500K - $1M</option>
          <option key="1000000-2000000" value="1000000-2000000">$1M - $2M</option>
          <option key="2000000+" value="2000000+">$2M+</option>
        </select>
        
        <Button 
          type="submit" 
          size="lg" 
          className="text-white border-0 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
        >
          <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
          Search
        </Button>
      </form>
    </motion.div>
  );
};

export default SearchPanel;