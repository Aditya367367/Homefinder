import React from "react";

const MAX_IMAGES = 6;

const ImageUploadSection = ({ formData, setFormData }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...previews].slice(0, MAX_IMAGES),
    }));
  };

  const images = formData.images || [];

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-4 text-white">Image Upload</h2>

      {images.length < MAX_IMAGES && (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-md cursor-pointer bg-[#1f2227] hover:border-blue-500 transition"
        >
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
          <p className="text-xs text-gray-500">
            You can upload {MAX_IMAGES - images.length} more
          </p>
        </label>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {images.map((imgObj, index) => (
            <div key={index} className="relative group">
              <img
                src={imgObj.preview}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border border-gray-700"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
