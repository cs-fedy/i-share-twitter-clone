import { useState, useContext } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import LOG_USER from "../graphql/login";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (element) => {
    const { name, value } = element.target;
    setFormValues((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const [logUser] = useMutation(LOG_USER, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    logUser({
      variables: formValues,
      update(proxy, result) {
        context.login(result.data.login);
        props.history.push("/");
      },
    });
  };

  return (
    <div className="w-screen h-screen items-center justify-center flex">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-2"
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          error={errors.username}
          name="username"
          type="text"
          id="username"
          label="username"
          className="mb-6"
          handleChange={handleChange}
          value={formValues.username}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          id="password"
          label="password"
          className="mb-6"
          handleChange={handleChange}
          value={formValues.password}
        />
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline">
            login
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/signup"
          >
            you don't have an account? signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
