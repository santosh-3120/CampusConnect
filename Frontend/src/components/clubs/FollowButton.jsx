import Button1 from '../common/Button1';

function FollowButton({ isFollowing, onFollow, onUnfollow, isLoading }) {
  return (
    <Button1
      onClick={isFollowing ? onUnfollow : onFollow}
      disabled={isLoading}
      variant={isFollowing ? 'secondary' : 'primary'}
    >
      {isLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button1>
  );
}

export default FollowButton;