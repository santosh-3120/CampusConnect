import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6'; // using react-icons v6

function SocialLinks({ socialLinks }) {
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return <p className="text-gray-400 italic">No social links available.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-white mb-2">Connect with Us</h4>
      <div className="flex space-x-4 text-2xl">
        {socialLinks.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="text-blue-500 hover:text-blue-600 transition"
          >
            <FaFacebook />
          </a>
        )}
        {socialLinks.x && (
          <a
            href={socialLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            title="X"
            className="text-gray-400 hover:text-black transition"
          >
            <FaXTwitter />
          </a>
        )}
        {socialLinks.instagram && (
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="text-pink-500 hover:text-pink-600 transition"
          >
            <FaInstagram />
          </a>
        )}
      </div>
    </div>
  );
}

export default SocialLinks;
