# Pokédex

This document lays out the goal of this little side-project. The main reason for building this app is to get up to speed with a certain tech-stack. This primarily consist of Next.js, TypeScript, GraphQL and Tailwind CSS. As a bonus, I also want to integrate Motion to the app. For fun, I choose to build a Pokémon-themed app, using the [PokéAPI](https://pokeapi.co/).

## Outline

### Tier 1

- [x] Setup Next.js project using `create-next-app`
- [x] Setup GitHub repository
- [x] Deploy project to Netlify
- [ ] Setup general project structure
  - [ ] General `layout.tsx`
  - [ ] `header.tsx` component
  - [ ] `navigation.tsx` component
  - [ ] `footer.tsx` component
  - [ ] Homepage with list of Pokémon
  - [ ] `PokeCard.tsx` component
    - Takes `Pokemon` as a prop
    - Bases color on the Pokémon's type
    - Enhance card interactivity using (source: https://www.frontend.fyi/tutorials/css-3d-perspective-animations)
  - [ ] Setup Apollo and GraphQL client
  - [ ] Setup GraphQL queries and mutations
  - [ ] Implement TypeScript type definitions
  - [ ] Pokémon detail page as a id based route
  - [ ] Simple about page as a separate route

  ### Tier 2
  - [ ] Implement Motion for micro-interactions
  - [ ] Add search and filter functionality
  - [ ] Add Skeleton loaders
  - [ ] Add initial and page switch Pokeball loading animation
  - [ ] Add e2e tests
  - [ ] Use `codegen` to generate types
  - [ ] Implement a dark mode version

## Note on AI usage

This project will mainly be handwritten, to a certain extent. I'll be using the Zed IDE to write the code. Zed provides autocomplete and other helpful features to speed up the development process. Those I will be using. For the rest of the proces I'll rely on documentation and other resources. Only when I'm stuck or need to learn something new will I turn to AI, keeping it teacher driven.
