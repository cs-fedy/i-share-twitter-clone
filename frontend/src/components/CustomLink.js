import React from "react"

const CustomLink = ({content, children, ...rest}) => {
    return (
        <a {...rest} className="block text-gray-700 text-md font-bold">
            {children}
        </a>
    );
}

export default CustomLink;