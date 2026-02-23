// components/common/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) {
  const baseClasses = "rounded-xl font-medium transition-all duration-200 flex items-center gap-2";
  
  const variants = {
    primary: "bg-[#EDAE49] text-[#003D5B] hover:bg-[#e5a23e] shadow-sm",
    outline: "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-500 hover:text-[#003D5B] hover:bg-gray-50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}