import {NextRequest} from "next/server";

export const POST = async (request: NextRequest) => {
    const {query, variables} = await request.json();

    try {
        if (query.trim().startsWith("mutation")) {
            // Handle mutation
        } else {
            // Handle query
        }
    } catch (e) {

    }
}