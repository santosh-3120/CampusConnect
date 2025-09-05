import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    date: '',
    location: '',
  });

  // Notify parent when filters change
  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center bg-transparent">
      <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 shadow-md flex-1 max-w-xs">
        <InputField
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
        />
      </div>
      <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 shadow-md flex-1 max-w-xs">
        <InputField
          label="Location"
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder={"Enter Location"}
          className="bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
        />
      </div>
    </div>
  );
};

export default EventFilter;