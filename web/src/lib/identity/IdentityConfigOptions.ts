import { LinkItemProps } from "../../components/core/NavItems"

export type IdentityConfigOptions = {
    client: {
        authority: string,
        client_id: string,
        scopes: string
    },
    links: Record<string,LinkItemProps>
}