import { AuthRole } from "@/services/authService";

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  isTemporary: boolean;
  permissions: AuthRole;
  priceRanking: PriceRanking;
  profilePicture?: string;
  hasProfilePicture: boolean;
};

export type PriceRanking = "member" | "regular" | "external" | null;
