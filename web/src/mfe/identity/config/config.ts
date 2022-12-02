import { LinkItemProps } from "../../shell/config/config"

export type IdentityConfigOptions = {
    client: {
        authority: string,
        client_id: string,
        scopes: string
    },
    links: Record<string,LinkItemProps>
}