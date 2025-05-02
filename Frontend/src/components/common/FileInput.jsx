const FileInput = ({ label, id, name, onChange, accept }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="file"
        id={id}
        name={name}
        onChange={onChange}
        accept={accept}
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
};

export default FileInput;