// utils/media.ts
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

export async function checkPhotoPermission(): Promise<boolean> {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  return status === "granted";
}

export async function checkCameraPermission(): Promise<boolean> {
  const { status } = await Camera.getCameraPermissionsAsync();
  return status === "granted";
}

export async function requestPhotoPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
}

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === "granted";
}

export async function openGallery(
  options: ImagePicker.ImagePickerOptions = {}
) {
  // Ensure library permission
  if (!(await checkPhotoPermission())) {
    const granted = await requestPhotoPermission();
    if (!granted) {
      throw new Error("Photo library permission denied");
    }
  }

  // Launch
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    ...options,
  });
}

export async function openCamera(options: ImagePicker.ImagePickerOptions = {}) {
  // Ensure camera permission
  if (!(await checkCameraPermission())) {
    const granted = await requestCameraPermission();
    if (!granted) {
      throw new Error("Camera permission denied");
    }
  }

  // Launch
  return ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    ...options,
  });
}
