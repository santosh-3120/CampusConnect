const Textarea = ({ label, id, name, value, onChange, rows = 4, placeholder }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 mb-2">
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          rows={rows}
          placeholder={placeholder}
        />
      </div>
    );
  };
  
  export default Textarea;