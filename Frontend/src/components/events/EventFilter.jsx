import React from 'react';

const EventFilter = ({ onFilter }) => {
  const handleChange = (e) => {
    onFilter({ [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Filter by Date</label>
      <input
        type="date"
        name="date"
        onChange={handleChange}
        className="input-field mb-4"
      />
      <label className="block text-gray-700 mb-2">Filter by Location</label>
      <input
        type="text"
        name="location"
        onChange={handleChange}
        className="input-field"
        placeholder="Enter location"
      />
    </div>
  );
};

export default EventFilter;