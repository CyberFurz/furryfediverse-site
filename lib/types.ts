export interface MastodonInstance {
  title: string;
  short_description?: string;
  description: string;
  thumbnail: string;
  stats: {
    user_count: number;
    status_count: number;
  };
  contact_account: {
    username: string;
  };
  registrations: boolean;
  approval_required: boolean;
}

export interface MisskeyInstance {
  name: string;
  description: string;
  bannerUrl: string;
  originalUsersCount: number;
  notesCount: number;
  disableRegistration: boolean;
}

export interface FunkwhaleInstance {
  metadata: {
    nodeName: string;
    shortDescription: string;
    contactemail: string;
    library: {
      tracks: {
        total: number;
      };
    };
  };
  banner: string;
  usage: {
    users: {
      total: number;
    };
  };
  openRegistrations: boolean;
}

export type ParsedMasterData = {
  title: string;
  description: string;
  thumbnail: string;
  user_count: number;
  status_count: number;
  instance_contact: string;
  registrations: boolean;
  approval_required: boolean;
};
