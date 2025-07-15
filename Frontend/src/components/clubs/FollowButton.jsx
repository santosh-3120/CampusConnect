import Button1 from '../common/Button1';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

function FollowButton({ isFollowing, onFollow, onUnfollow, isLoading }) {
  const handleClick = () => {
    if (isLoading) return;
    isFollowing ? onUnfollow() : onFollow();
  };

  return (
    <Button1
      onClick={handleClick}
      disabled={isLoading}
      variant={isFollowing ? 'unfollow' : 'follow'}
    >
      {isLoading ? (
        'Processing...'
      ) : isFollowing ? (
        <>
          <FaUserCheck className="inline-block mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <FaUserPlus className="inline-block mr-2" />
          Follow
        </>
      )}
    </Button1>
  );
}

export default FollowButton;
