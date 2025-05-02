const Select = ({ label, id, name, value, onChange, options }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 mb-2">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default Select;