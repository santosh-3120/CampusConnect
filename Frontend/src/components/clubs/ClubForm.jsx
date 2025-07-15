import { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import Textarea from '../common/Textarea';
import FileInput from '../common/FileInput';
import Button1 from '../common/Button1';
import { SOCIAL_MEDIA_PLATFORMS } from '../../utils/constants';

function ClubForm({ club, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    socialLinks: {},
  });

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name || '',
        description: club.description || '',
        logo: null,
        socialLinks: club.socialLinks || {},
      });
    }
  }, [club]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [platform]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }
    data.append('socialLinks', JSON.stringify(formData.socialLinks));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-yellow-300 text-center">{club ? 'Edit Club' : 'Create Club'}</h2>

      <div>
        <label className="block mb-1 text-gray-300">Club Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
          placeholder="Enter club name"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-300">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
          placeholder="Enter club description"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-300">Club Logo</label>
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          accept="image/*"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-yellow-300">Social Media Links</h4>
        {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
          <div key={platform}>
            <label className="block mb-1 text-gray-300">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </label>
            <input
              type="url"
              name={platform}
              value={formData.socialLinks[platform] || ''}
              onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              placeholder={`https://${platform}.com/your-profile`}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : club ? 'Update Club' : 'Create Club'}
      </button>
    </form>
  );
}

export default ClubForm;
