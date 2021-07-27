import React from "react"

const Input = (props) => {
  const { error, name, type, id, label, handleChange, value } = props;

  return (
    <React.Fragment>
      <label
        htmlFor={id}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        name={name}
        type={type}
      />
      {error && (
        <p className="text-red-500 text-xs italic">{error}</p>
      )}
    </React.Fragment>
  );
};

export default Input;
