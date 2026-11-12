import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { fetchPokemonApi } from "@/lib/pokemon-request";

export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://graphql.pokeapi.co/v1beta2",
      fetch: fetchPokemonApi,
    }),
  });
});
