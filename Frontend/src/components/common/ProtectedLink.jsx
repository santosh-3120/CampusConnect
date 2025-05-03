import { Link } from 'react-router-dom';

function ProtectedLink({ to, children, ...props }) {
  const handleClick = () => {
    if (to === '/clubs') {
      localStorage.setItem('fromDashboard', 'true');
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export default ProtectedLink;