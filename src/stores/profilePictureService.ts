import { Directory, Filesystem } from "@capacitor/filesystem";

import { getUserProfilePicture } from "@/services/dataService";

export async function cacheProfilePicture(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64Data = await convertBlobToBase64(blob);

    await Filesystem.writeFile({
      path: `${filename}.jpeg`,
      data: base64Data,
      directory: Directory.Data,
    });

    console.debug("Profile picture " + filename + " cached successfully.");
  } catch (error) {
    console.error("Error caching profile picture:", error);
  }
}

// Helper function to convert Blob to Base64
const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });

export async function loadCachedProfilePicture(filename: string) {
  try {
    const file = await Filesystem.readFile({
      path: `${filename}.jpeg`,
      directory: Directory.Data,
    });

    return `data:image/jpeg;base64,${file.data}`;
  } catch {
    return null;
  }
}

export async function fetchCachedUserProfilePicture(
  userId: string
): Promise<string> {
  try {
    const cachedProfilePicture = await loadCachedProfilePicture(userId);

    if (cachedProfilePicture) {
      return cachedProfilePicture;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error loading (cached) profile picture:", error);
    return "";
  }
}

export async function fetchUncachedProfilePicture(userId: string) {
  try {
    const loadedProfilePicture = await getUserProfilePicture(userId);
    await cacheProfilePicture(loadedProfilePicture, userId);
  } catch (error) {
    console.error("Error refreshing (cached) profile picture:", error);
    return "";
  }
}
