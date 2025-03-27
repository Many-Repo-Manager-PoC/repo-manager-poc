export interface Repo {
    id: number;
    full_name: string;
    name: string;
    repo: string;
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
    open_issues_count: number;
    license: {
      name: string;
    };
  
  }

  export interface Dependency {
    repo: string;
    dependencies: {
      sbom: {
        spdxVersion: string;
        dataLicense: string;
        SPDXID: string;
        relationshipType: string;
        name: string;
      documentNamespace: string;
      creationInfo: {
        created: string;
        creators: string[];
      };
      packages: Package[];
    };
      relationships: Relationship[];
  }
  error:null;
}

export interface Relationship {
  spdxElementId: string;
  relationshipType: string;
  relatedSpdxElement: string;
}

  export interface PackageJson {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    repo: string;
  }



  export interface NewRepository {
    repoName: string;
    repoDescription?: string;
    homepage?: string;
    isPrivate?: boolean;
    visibility?: string;
    hasIssues?: boolean;
    hasProjects?: boolean;
    hasWiki?: boolean;
    hasDownloads?: boolean;
    isTemplate?: boolean;
    teamId?: number;
    autoInit?: boolean;
    gitignoreTemplate?: string;
    licenseTemplate?: string;
    allowSquashMerge?: boolean;
    allowMergeCommit?: boolean;    
    allowRebaseMerge?: boolean;
    allowAutoMerge?: boolean;
    deleteBranchOnMerge?: boolean;
    useSquashPrTitleAsDefault?: boolean;
    squashMergeCommitTitle?: string;
    squashMergeCommitMessage?: string;
    mergeCommitTitle?: string;
    mergeCommitMessage?: string;
    customProperties?: Record<string, string>;
    hasDiscussions?: boolean;
  }

  export interface Package {
    name: string;
    SPDXID: string;
    licenseConcluded: string;
    externalRefs: []
    downloadLocation: string;
    versionInfo: string;
    filesAnalyzed: boolean;
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