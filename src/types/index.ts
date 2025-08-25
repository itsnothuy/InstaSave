export interface InstagramMedia {
  id: string;
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnail?: string;
  caption?: string;
  username?: string;
  displayUrl?: string;
  downloadUrls: MediaDownloadOption[];
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: number;
  };
}

export interface MediaDownloadOption {
  id: string;
  type: 'image' | 'video';
  quality: 'low' | 'medium' | 'high' | 'original';
  url: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  label: string;
}

export interface InstagramPost {
  shortcode: string;
  id: string;
  typename: string;
  caption?: string;
  commentsDisabled: boolean;
  takenAtTimestamp: number;
  likesCount: number;
  commentsCount: number;
  owner: {
    id: string;
    username: string;
    fullName?: string;
    profilePicUrl?: string;
    isVerified?: boolean;
  };
  media: InstagramMedia[];
  location?: {
    id: string;
    name: string;
    slug?: string;
  };
  hashtags?: string[];
  mentions?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DownloadProgress {
  id: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  filename?: string;
  error?: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  fullName?: string;
  biography?: string;
  profilePicUrl?: string;
  profilePicUrlHd?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isVerified?: boolean;
  isPrivate?: boolean;
  externalUrl?: string;
}

export interface ResolverOptions {
  includeMetadata?: boolean;
  includeThumbnails?: boolean;
  maxQuality?: 'low' | 'medium' | 'high' | 'original';
  timeout?: number;
}
