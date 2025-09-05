import React, { useState } from 'react';
import InputField from '../common/InputField';
import Select from '../common/Select';
import { ITEM_CATEGORIES, ITEM_TYPES } from '../../utils/constants';

const ItemFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    title: '',
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    onFilter({ ...filters, [name]: value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg max-w-7xl mx-auto">
      <h2 className="text-yellow-300 text-xl font-semibold mb-5">Filter Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputField
          label="Search by Title"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Enter item title"
          inputClass="bg-gray-700 text-black placeholder-gray-400 border border-gray-600 focus:border-yellow-400 focus:ring focus:ring-yellow-400/50"
          labelClass="text-white"
        />
        <Select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={[{ value: '', label: 'All Categories' }, ...ITEM_CATEGORIES.map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
          }))]}
          selectClass=""
          labelClass="text-gray-300"
        />
        <Select
          label="Type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={[{ value: '', label: 'All Types' }, ...ITEM_TYPES.map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
          }))]}
          selectClass=""
          labelClass="text-gray-300"
        />
        <InputField
          label="Min Price"
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min price"
          inputClass="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-yellow-400 focus:ring focus:ring-yellow-400/50"
          labelClass="text-gray-300"
        />
        <InputField
          label="Max Price"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max price"
          inputClass="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-yellow-400 focus:ring focus:ring-yellow-400/50"
          labelClass="text-gray-300"
        />
        <Select
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleChange}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Available', label: 'Available' },
            { value: 'Sold', label: 'Sold' },
          ]}
          selectClass=""
          labelClass="text-gray-300"
        />
      </div>
    </div>
  );
};

export default ItemFilter;
