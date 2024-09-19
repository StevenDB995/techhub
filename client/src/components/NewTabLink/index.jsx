import { Link } from 'react-router-dom';

function NewTabLink({ children, to, ...props }) {
  return (
    <Link
      to={to}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </Link>
  );
}

export default NewTabLink;
