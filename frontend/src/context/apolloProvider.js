import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import App from "../App";

const authLink = setContext(() => {
  const token = localStorage.getItem("JWT_TOKEN");
  return  {
    headers: {
      authorization: token ? `Bearer ${token}`: ""
    }
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
