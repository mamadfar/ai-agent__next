import {ApolloClient, DefaultOptions, HttpLink, InMemoryCache} from "@apollo/client";

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
    }
}

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    headers: {
        Authorization: `Apikey ${process.env.GRAPHQL_TOKEN}`
    },
    fetch
})

export const serverClient = new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions
})