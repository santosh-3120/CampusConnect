import { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import Textarea from '../common/Textarea';
import FileInput from '../common/FileInput';
import Button from '../common/Button';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Club Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <FileInput
        label="Club Logo"
        name="logo"
        onChange={handleFileChange}
        accept="image/*"
      />
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Social Media Links</h4>
        {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
          <InputField
            key={platform}
            label={platform.charAt(0).toUpperCase() + platform.slice(1)}
            name={platform}
            value={formData.socialLinks[platform] || ''}
            onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
            placeholder={`https://${platform}.com/your-profile`}
          />
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : club ? 'Update Club' : 'Create Club'}
      </Button>
    </form>
  );
}

export default ClubForm;
