function SocialLinks({ socialLinks }) {
    if (!socialLinks || Object.keys(socialLinks).length === 0) {
      return <p className="text-gray-600">No social links available.</p>;
    }
  
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect with Us</h4>
        <div className="flex space-x-4">
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
          )}
          {socialLinks.x && (
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:underline"
            >
              X
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Instagram
            </a>
          )}
          
        </div>
      </div>
    );
  }
  
  export default SocialLinks;