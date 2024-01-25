import axios from "axios";

const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const uploadFolder = process.env.REACT_APP_CLOUDINARY_UPLOAD_FOLDER;
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const uploadToCloudinary = async (selectedImage: any) => {
  if (uploadPreset && cloudName) {
    const cloudinaryURL = `${process.env.REACT_APP_CLOUDINARY_API_BASE_URL}/image/upload`;
    const image = new FormData();
    image.append("file", selectedImage);
    image.append("upload_preset", uploadPreset);
    image.append("cloud_name", cloudName);
    image.append("folder", uploadFolder!);

    try {
      const { data } = await axios.post(cloudinaryURL, image, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.public_id;
    } catch (error) {
      return error;
    }
  }
};

export default uploadToCloudinary;
