function Toast({ message, type = 'info', onClose }) {
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
          type === 'info' ? 'bg-blue-600' : 'bg-red-600'
        } flex items-center space-x-4 z-50`}
      >
        <p>{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    );
  }
  
  export default Toast;