import {
  component$,
  useVisibleTask$,
  useStore,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";
import Infobox from "../../components/starter/infobox/infobox";
import { type Repo } from "../../types/index";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useGetRepos = routeLoader$(async (requestEvent) => {

  try {
    const response = await fetch(`https://api.github.com/orgs/kunai-consulting/repos`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Cloudflare Worker",
        
        Authorization: `Cookie ${requestEvent.cookie.get('authjs.session-token')?.value}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const repositories = await response.json();
    return repositories as Repo[];
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [] as Repo[];
  }
});

// export const useGetAccessToken = routeLoader$(async (requestEvent) => {
//   const clientId = requestEvent.env.get('AUTH_GITHUB_ID');
//   const clientSecret = requestEvent.env.get('AUTH_GITHUB_SECRET');
//   const code = requestEvent.url.searchParams.get('code');
//   console.log(code);

//   const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {
//     headers: {
//       'Accept': 'application/json'
//     }
//   });
//   const data = await response.json() as { access_token: string };
//   return data.access_token;
// });

export default component$(() => {
  const nav = useNavigate();
  const getRepos = useGetRepos();
  console.log(getRepos.value);
//   const getAccessToken = useGetAccessToken();
//   console.log(getAccessToken.value);

  const state = useStore({
    count: 0,
    number: 20,
  });

  useVisibleTask$(({ cleanup }) => {
    const timeout = setTimeout(() => (state.count = 1), 500);
    cleanup(() => clearTimeout(timeout));

    const internal = setInterval(() => state.count++, 7000);
    cleanup(() => clearInterval(internal));
  });

  return (
    <div class="container container-center">
      <div role="presentation" class="ellipsis"></div>
      <h1>
        <span class="highlight">All</span> Repositories
      </h1>

      <div class="grid">
        {getRepos.value?.map((repo) => (
          <Infobox repo={repo} nav={nav} key={repo.id}></Infobox>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
};

