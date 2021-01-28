import { Link } from 'react-router-dom';

const CustomLink = ({content, children, ...rest}) => {
    return (
        <Link {...rest} className="block text-gray-700 text-md font-bold">
            {children}
        </Link>
    );
}

export default CustomLink;