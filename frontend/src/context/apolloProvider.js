import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import App from "../App";

const authLink = setContext(() => {
  const token = localStorage.getItem("JWT_TOKEN");
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("JWT_TOKEN"),
    },
  },
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

//* use split for proper “routing” of the requests and update the constructor call of ApolloClient
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
