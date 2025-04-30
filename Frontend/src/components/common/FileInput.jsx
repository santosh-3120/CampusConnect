import { useField } from 'formik';

function FileInput({ name }) {
  const [, meta, helpers] = useField(name);

  const handleChange = (e) => {
    const file = e.target.files[0];
    helpers.setValue(file);
    helpers.setTouched(true);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
}

export default FileInput;