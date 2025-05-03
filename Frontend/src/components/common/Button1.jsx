function Button1({ children, type = 'button', variant = 'primary', disabled, onClick }) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
      primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
  
    return (
      <button
        type={type}
        className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
}
  
export default Button1;
