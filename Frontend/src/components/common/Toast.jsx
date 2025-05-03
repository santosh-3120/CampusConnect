const Toast = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${
        type === 'error' ? 'bg-red-600' : 'bg-green-600'
      }`}
    >
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        ×
      </button>
    </div>
  );
};

export default Toast;