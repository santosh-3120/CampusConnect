import InputField from '../common/InputField';
import Select from '../common/Select';

const LostFoundFilter = ({ filter, setFilter, search, setSearch }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
      <div className="mb-4 sm:mb-0">
        <Select
          label="Filter by Status"
          id="filter"
          name="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'lost', label: 'Lost' },
            { value: 'found', label: 'Found' },
          ]}
        />
      </div>
      <div>
        <InputField
          label="Search by Name"
          id="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
        />
      </div>
    </div>
  );
};

export default LostFoundFilter;