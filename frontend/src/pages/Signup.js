import { useState, useContext } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import REGISTER_USER from "../graphql/signup";

const Signup = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (element) => {
    const { name, value } = element.target;
    setFormValues((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const [registerUser] = useMutation(REGISTER_USER, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    registerUser({
      variables: formValues,
      update(proxy, result) {
        context.login(result.data.signup);
        props.history.push("/");
      },
    });
  };

  return (
    <div className="w-screen h-screen items-center justify-center flex">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          error={errors.email}
          name="email"
          type="email"
          id="email"
          label="email"
          handleChange={handleChange}
          value={formValues.email}
        />
        <Input
          error={errors.username}
          name="username"
          type="text"
          id="username"
          label="username"
          handleChange={handleChange}
          value={formValues.username}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          id="password"
          label="password"
          handleChange={handleChange}
          value={formValues.password}
        />
        <Input
          error={errors.confirmPassword}
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          label="confirm password"
          handleChange={handleChange}
          value={formValues.confirmPassword}
        />
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline">
            signup
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/login"
          >
            you have an account? login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
