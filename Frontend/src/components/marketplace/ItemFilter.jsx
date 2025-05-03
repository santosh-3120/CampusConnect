import React from 'react';

const ItemFilter = ({ onFilter }) => {
  const handleChange = (e) => {
    onFilter({ [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Filter by Category</label>
      <input
        type="text"
        name="category"
        onChange={handleChange}
        className="input-field mb-4"
        placeholder="Enter category"
      />
      <label className="block text-gray-700 mb-2">Filter by Type</label>
      <select name="type" onChange={handleChange} className="input-field">
        <option value="">All</option>
        <option value="sale">Sale</option>
        <option value="donation">Donation</option>
      </select>
    </div>
  );
};

export default ItemFilter;