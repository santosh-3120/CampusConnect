export const Navbar = ({
  name,
  username = "John doe",
  toggleModal,
  logout,
}) => {
  // console.log(user);
  return (
    <nav className='bg-gray-900 text-white bg-opacity-90 shadow-lg p-4'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>CampusConnect {name}</h1>
        <div className='space-x-4'>
          <button onClick={toggleModal} className='hover:text-yellow-300'>
            {username}
          </button>
          <button onClick={logout} className='hover:text-yellow-300'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
