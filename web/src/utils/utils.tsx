import { FieldError } from "../graphql/identity/graphql";

export const toErrorMap = (errors:FieldError[]) => {
    const map : Record<string,string> = {}
    errors.forEach(({field,message})=>{
        map[field]=message;
    })
    return map
}

export const isServerSide = () => typeof window === "undefined";