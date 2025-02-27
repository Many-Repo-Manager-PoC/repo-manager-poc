export interface Repo {
    id: number;
    full_name: string;
    name: string;
    html_url: string;
    url: string;
    language: string;
    description: string;
    updated_at: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    homepage: string;
    topics: string[];
  
  }
  
  export interface Member {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }
  
  export interface Commit {
    html_url: string;
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      }
  
    };
    author:{
      login:string;
    };
  }