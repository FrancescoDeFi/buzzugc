
export interface User {
  username: string;
  plan?: string;
  creationsUsed?: number;
  creationsLimit?: number;
}

export interface Avatar {
  id: number;
  name: string;
  imageUrl: string;
  gender?: string;
  ageGroup?: string;
  situation?: string;
  isPro?: boolean;
  isHD?: boolean;
}
