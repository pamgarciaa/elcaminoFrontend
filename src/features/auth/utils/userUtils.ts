import { IMAGE_URL } from "../../../config/constants";

export const getUserProfileUrl = (
  profilePicture: string | undefined | null
) => {
  if (!profilePicture) return undefined;
  if (profilePicture.startsWith("http")) return profilePicture;
  return `${IMAGE_URL}/uploads/users/${profilePicture}`;
};

export const getUserInitials = (name?: string, username?: string) => {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (username && username.length > 0) return username[0].toUpperCase();
  return "U";
};

export const getDisplayName = (user: any) => {
  return user.name || user.username || "Usuario";
};
export const formatUserRole = (role?: string) => {
  if (!role || role.length === 0) return "N/A";
  return role.charAt(0).toUpperCase() + role.slice(1);
};
