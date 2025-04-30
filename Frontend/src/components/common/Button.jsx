function Button({ children, className, ...props }) {
    return (
      <button
        {...props}
        className={`transition-colors ${className}`}
      >
        {children}
      </button>
    );
  }
  
  export default Button;