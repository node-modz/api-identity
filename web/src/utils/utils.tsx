import { CombinedError } from "urql";
import { FieldError } from "../graphql/identity/graphql";

export const toErrorMap = (errors:FieldError[]) => {
    const map : Record<string,string> = {}
    errors.forEach(({field,message})=>{
        map[field]=message;
    })
    return map
}

export const isServerSide = () => typeof window === "undefined";

export const isAuthError = (error:CombinedError) => {
    return error.graphQLErrors.some(
        e => e.extensions?.code === 'UNAUTHENTICATED',
    );
}