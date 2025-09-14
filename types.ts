
export interface User {
  username: string;
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
