import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { auth } from "./auth"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(),
        // Enables `authClient.token` — reads the JWT access token that the
        // JWT plugin (server) mints on login/registration. Protected API
        // calls attach it as `Authorization: Bearer <token>`.
        jwtClient(),
    ],
})