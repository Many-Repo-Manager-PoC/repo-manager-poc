import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  ({ env }) => ({
    secret: env.get('AUTH_SECRET'),
    trustHost: true,
    useSecureCookies: env.get('VITE_SSL') === 'true',
    providers: [
      GitHub({
        clientId: env.get('AUTH_GITHUB_ID'),
        clientSecret: env.get('AUTH_GITHUB_SECRET'),
      }),
    ],
    cookies:{
      pkceCodeVerifier: {
        name: "github.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: "/",
          secure: true
        },
      },
    },
  }),
);