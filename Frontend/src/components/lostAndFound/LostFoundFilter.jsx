import { useState } from 'react';
import Button from '../common/Button';

function LostFoundFilter({ onFilter }) {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  const handleApplyFilters = () => {
    onFilter({ status, search, sort });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by item name..."
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="recent">Most Recent</option>
      </select>
      <Button
        onClick={handleApplyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Apply Filters
      </Button>
    </div>
  );
}

export default LostFoundFilter;