import React, { useEffect, useState } from "react";
import { useUserService } from "../../auth/services/user.services";

const ProfileSettingsForm = () => {
  const { user, isLoading, updateProfile, updateLoading, refetch } = useUserService();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "normal",
    bio: "",
    gender: "",
    birth_date: "",
    
    profile_pic: null, 
    profile_pic_url: "", 
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        userType: user.user_type || "normal",
        bio: user.bio || "",
        gender: user.gender || "",
        birth_date: user.birth_date || "",
        profile_pic: null, 
        profile_pic_url: user.profile_pic || "", 
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // New handler for file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_pic: file,
        profile_pic_url: URL.createObjectURL(file), // Create a temporary URL for immediate preview
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profile_pic: null,
        profile_pic_url: user?.profile_pic || "", 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData(); 
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("user_type", formData.userType); 
    payload.append("bio", formData.bio);
    payload.append("gender", formData.gender);
    payload.append("birth_date", formData.birth_date);

   
    if (formData.profile_pic) {
      payload.append("profile_pic", formData.profile_pic);
    }

    updateProfile(payload, {
      onSuccess: async (data) => {
        setFormData({
          ...formData,
          ...data.user,
          userType: data.user?.user_type || formData.userType,
          profile_pic: null, 
          profile_pic_url: data.user?.profile_pic || "", 
        });
        setIsEditing(false);
        await refetch();
      },
      onError: (error) => {
        console.error("Profile update failed:", error);
      
      }
    });
  };

  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <div className="mb-16">
      <h2 className="text-xl font-semibold mb-6 text-white">Profile Settings</h2>

      {!isEditing ? (
        <div className="space-y-4 bg-[#1a1d21] p-6 rounded-md">
          {formData.profile_pic_url && (
            <div className="mb-4">
              <img
                src={formData.profile_pic_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
          <p className="text-white">Name: {formData.name}</p>
          <p className="text-white">Email: {formData.email}</p>
          <p className="text-white">Phone: {formData.phone}</p>
          <p className="text-white">User Type: {formData.userType}</p>
          <p className="text-white">Gender: {formData.gender}</p>
          <p className="text-white">Birth Date: {formData.birth_date}</p>
          <p className="text-white">Bio: {formData.bio}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-600 px-4 py-2 rounded-md text-white"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1d21] p-6 rounded-md">
         
          <div className="flex items-center space-x-4">
            {formData.profile_pic_url && (
              <img
                src={formData.profile_pic_url}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <label className="block text-white">
              Profile Picture:
              <input
                type="file"
                name="profile_pic"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </label>
          </div>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          />
          <input
            name="email"
            value={formData.email}
            disabled
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          />
          <input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          />
          <input
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f2227] text-white"
          >
            <option value="normal">Normal</option>
            <option value="landlord">Landlord</option>
            <option value="buyer_renter">Buyer/Renter</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={updateLoading}
              className="bg-blue-600 px-6 py-2 rounded text-white"
            >
              {updateLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 px-6 py-2 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSettingsForm;