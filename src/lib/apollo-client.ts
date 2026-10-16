import { HttpLink } from "@apollo/client";
import { fetchPokemonApi } from "@/lib/pokemon-request";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://graphql.pokeapi.co/v1beta2",
      fetch: fetchPokemonApi,
    }),
  });
});
