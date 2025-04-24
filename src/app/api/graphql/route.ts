import {NextRequest, NextResponse} from "next/server";
import {serverClient} from "@/lib/graphql/server/serverClient";
import {gql} from "@apollo/client";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
}

export const POST = async (request: NextRequest) => {
    const {query, variables} = await request.json();

    try {
        let result;
        if (query.trim().startsWith("mutation")) {
            // Handle mutation
            result = await serverClient.mutate({
                mutation: gql`${query}`,
                variables
            })
            console.log('mutation', result)
        } else {
            // Handle query
            result = await serverClient.query({
                query: gql`${query}`,
                variables
            })
        }
        const data = result.data
        console.log(data)
        return NextResponse.json({
            data
        }, {
            headers: corsHeaders
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json(e, {
            status: 500
        })
    }
}