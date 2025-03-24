'use client';

import {FC} from 'react';
import {IPageChildren} from "@/types/Common.type";
import {ApolloProvider as Provider} from "@apollo/client";
import client from "@/lib/graphql/apolloClient";

const ApolloProvider: FC<IPageChildren> = ({children}) => {
    return <Provider client={client}>{children}</Provider>
};

export default ApolloProvider;
