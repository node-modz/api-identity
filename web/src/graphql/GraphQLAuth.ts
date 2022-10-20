import { NextRouter } from "next/router";
import { CombinedError } from "urql";
import { isAuthError } from "../utils/utils";

//
// Tried creating an RouterHistory using the recommendation 
// here: https://github.com/remix-run/react-router/issues/8264
// but the router.push("/identity/login") did not render the page. 
// I feel it could be failing because of server side & client side rendering of components.
//
// so went with the path of using wrapper graphQL API's.
// 
export type ViewContext = {
    router: NextRouter
};


export const authCheck = (
    { context, error, fetching }: { context: ViewContext, fetching: boolean, error?: CombinedError }) => {

    // TODO: could there will be race condition here, what if the this check is done while data is being fetched.
    if (!fetching && error) {
        if (isAuthError(error)) {
            console.log("auth error: redirecting to login page.");
            context.router.push("/identity/login");
        }
    }
}