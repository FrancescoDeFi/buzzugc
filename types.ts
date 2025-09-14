
export interface User {
  username: string;
  plan?: string;
  creationsUsed?: number;
  creationsLimit?: number;
  subscriptionStatus?: 'active' | 'inactive' | 'canceled' | 'past_due';
  subscriptionId?: string;
  customerId?: string;
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
