function Button1({ children, type = 'button', variant = 'primary', disabled, onClick }) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  const variantStyles = {
  primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',

  follow: 'bg-white/10 text-yellow-300 border border-yellow-400 hover:bg-white/20 backdrop-blur-md focus:ring-yellow-300',
  unfollow: 'bg-white/10 text-yellow-500 border border-yellow-500 hover:bg-white/20 backdrop-blur-md focus:ring-yellow-400',
};



  return (
    <button
      
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button1;
