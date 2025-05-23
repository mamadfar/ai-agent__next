import {ApolloClient, createHttpLink, DefaultOptions, InMemoryCache} from "@apollo/client";

export const BASE_URL = process.env.NODE_ENV !== 'development' ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`;

//? Explain: This code sets up an Apollo Client for client-side rendering

const httpLink = createHttpLink({
    uri: `${BASE_URL}/api/graphql`, //? Proxy on the server to the graphql endpoint (stepzen)
})

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

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions
})

export default client;