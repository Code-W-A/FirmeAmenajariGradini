import { authentication, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  updateMetadata, // Import this module
} from "firebase/storage";
import { getBlobFromUri } from "./getBlobFromUri";
import imageCompression from "browser-image-compression";
// import { writeImg } from "./realtimeUtils";

export const uploadImage = async (
  images,
  newImage,
  firstLocation,
  deletedLogo
) => {
  const imageUpload = images[0];
  const authInstance = authentication;
  const currentUser = authInstance.currentUser;
  let finalUri;
  const fileName = new Date().getTime();
  try {
    if (newImage && deletedLogo) {
      // Create a reference to the file to delete
      const deletedRef = ref(storage, `images/${firstLocation}/${deletedLogo}`);

      // Delete the file
      deleteObject(deletedRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
    }

    if (!imageUpload) {
      return;
    }

    if (imageUpload instanceof File) {

      // Options for image compression
      const options = {
        maxSizeMB: 0.2, // (Max file size in MB)
        maxWidthOrHeight: 1920, // (Compressed files are scaled to these dimensions)
        useWebWorker: true, // (Use a web worker to perform the compression in a separate thread)
      };

      // Compress the image file
      const compressedFile = await imageCompression(imageUpload, options);

      const imageRef = ref(storage, `images/${firstLocation}/${fileName}`);

      // Set the content type to image/jpeg
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload the image with metadata
      const snapshot = await uploadBytes(imageRef, compressedFile, metadata);

      // Get the download URL for the uploaded image
      finalUri = await getDownloadURL(snapshot.ref);

    } else {
      return imageUpload;
    }
  } catch (error) {
  }
  return { finalUri, fileName };
};
export const deleteImage = async (
  firstLocation,
  secondLocation,
  oldFileName
) => {
  try {
    // Create a reference to the file to delete
    const deletedRef = ref(storage, `images/${firstLocation}/${oldFileName}`);

    // Delete the file
    deleteObject(deletedRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });

  } catch (error) {
  }
};

export const uploadMultipleImages = async (
  images, // Acesta va fi acum un array de imagini
  newImage,
  firstLocation,
  deletedImages,
  alts // optional: map keyed by File.name or existing fileName -> alt text
) => {
  const authInstance = authentication;
  const currentUser = authInstance.currentUser;
  let imgs = [];

  const getAltFor = (key) => {
    if (!alts) return "";
    if (typeof alts === "object" && !Array.isArray(alts)) {
      return alts[key] || "";
    }
    return "";
  };

  try {
    if (!images.length) {
      return;
    }

    if (newImage && deletedImages.length > 0) {
      // Presupunem că `images.fileNames` este un array cu numele fișierelor pe care vrei să le ștergi
      // și că `firstLocation` este un string care reprezintă locația inițială a acestor fișiere în Firebase Storage

      for (let i = 0; i < deletedImages.length; i++) {
        const fileName = deletedImages[i].fileName; // Obținem fiecare nume de fișier din array
        const deletedRef = ref(storage, `images/${firstLocation}/${fileName}`); // Creăm referința la fișier

        try {
          await deleteObject(deletedRef); // Încercăm să ștergem fișierul
// Logăm succesul dacă fișierul a fost șters
        } catch (error) {
          console.error(`Error deleting ${fileName}:`, error); // Logăm eroarea în caz de eșec
        }
      }
    }

    for (const imageUpload of images) {
      if (imageUpload instanceof File) {
        const fileName =
          new Date().getTime() + "_" + images.indexOf(imageUpload); // Asigură unicitate
        const imageRef = ref(storage, `images/${firstLocation}/${fileName}`);
        const metadata = {
          contentType: "image/jpeg",
        };

        const options = {
          maxSizeMB: 0.2, // (Max file size in MB)
          maxWidthOrHeight: 1920, // (Compressed files are scaled to these dimensions)
          useWebWorker: true, // (Use a web worker to perform the compression in a separate thread)
        };

        // Compress the image file
        const compressedFile = await imageCompression(imageUpload, options);

        const snapshot = await uploadBytes(imageRef, compressedFile, metadata);
        const finalUri = await getDownloadURL(snapshot.ref);

        const alt = getAltFor(imageUpload.name) || "";
        imgs.push({ finalUri, fileName, alt });
      } else {
        const existingKey =
          imageUpload.fileName || imageUpload.finalUri || "";
        const alt =
          getAltFor(existingKey) ||
          getAltFor(imageUpload.finalUri) ||
          imageUpload.alt ||
          "";
        imgs.push({
          finalUri: imageUpload.finalUri,
          fileName: imageUpload.fileName,
          alt,
        });
      }
    }
  } catch (error) {
  }
  return { imgs }; // Returnează array-uri cu URI-urile și numele fișierelor
};

export const deleteMultipleImages = async (
  firstLocation,
  oldFileNames // Acesta va fi acum un array de nume de fișiere
) => {
  try {
    for (const fileName of oldFileNames) {
      const deletedRef = ref(storage, `images/${firstLocation}/${fileName}`);
      await deleteObject(deletedRef);
    }
  } catch (error) {
  }
};

// export async function getUrlImageApi() {
//   const imageRef = ref(storage, `images/PozaApi/apiimage.jpeg`);
//   try {
//     const url = await getDownloadURL(imageRef);
//     writeImg(url);
//     return url;
//   } catch (error) {
//     console.error(error);
//     return null; // sau gestionează eroarea după cum consideri necesar
//   }
// }
