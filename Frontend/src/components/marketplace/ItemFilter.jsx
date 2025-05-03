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
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-2">Filter Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Search by Title"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Enter item title"
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
        />
        <InputField
          label="Min Price"
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min price"
        />
        <InputField
          label="Max Price"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max price"
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
        />
      </div>
    </div>
  );
};

export default ItemFilter;