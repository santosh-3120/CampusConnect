# CampusConnect Hub

CampusConnect Hub is a full-stack web application designed for campus communities to connect, share, and manage campus-related activities. It provides modules for Marketplace, Clubs, Events, and Lost & Found items, making campus life more interactive and organized.

**Live Demo**

**Frontend:** [CampusConnect Hub](https://campusconnecthub.onrender.com)  
**Backend API:** [CampusConnect Backend](https://campusconnect-bcew.onrender.com)

## Features

### 1. **Marketplace**

* Users can **buy and sell items** by providing details like price, description, and images.
* **Multiple search and filter options** available: maximum price, minimum price, type, etc.
* Sellers can create items with images, which are uploaded to **Cloudinary** for storage.

### 2. **Clubs**

* Only users with the **admin role** can create clubs and manage followers.
* **Club messages** can only be sent by admins. Followers can view club messages.
* Club information (name, description, logo) is visible to all users, but messages are restricted to followers.
* Club logos are uploaded to **Cloudinary**.

### 3. **Events**

* Admins can **create events** with images, location, and date.
* When an event is created, a **notification email** is sent to all users in the database using **Nodemailer**.
* Users can **RSVP** to events.
* Events can be searched by **location** or **event name**.

### 4. **Lost & Found**

* Users can report **lost or found items** on campus.
* Details include handover location and the person the item was handed to.
* Any user can claim an item, and claimed items are marked appropriately.

## Tech Stack

* **Frontend:** React, Tailwind CSS, Nginx
* **Backend:** Node.js, Express.js, MongoDB
* **Authentication & Authorization:** JWT, Role-based access
* **File Storage:** Cloudinary for images (Marketplace and Clubs)
* **Email Notifications:** Nodemailer
* **Real-time Communication:** Socket.IO for club messages

## Setup Instructions

### Backend

1. Navigate to the `Backend` directory:

   ```bash
   cd Backend
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Add `.env` file with keys:

   ```
   MONGO_URI=Your MONGO_URI_here
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=Cloudinary_Cloud_Name_here
   CLOUDINARY_API_KEY=Your_Cloudinary_API_Key_here
   CLOUDINARY_API_SECRET=Your_Cloudinary_API_Secret_here
   EMAIL_USER=Your_Email_here
   EMAIL_PASS=Your_Email_Password_here(App_Password if 2FA enabled)
   ```
4. Start the server:

   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `Frontend` directory:

   ```bash
   cd Frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Add `.env` file with keys:

   ```
   VITE_API_URL=/api
   VITE_SOCKET_URL=/socket.io
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

### Docker Deployment

* The project can be deployed using Docker for both backend and frontend.
* Use `docker-compose` or individual Dockerfiles to build and run containers.
* Nginx handles frontend routing and proxies API and Socket.IO requests to the backend.

## Usage

* Access the application through your frontend URL.
* Sign up or log in to interact with Marketplace, Clubs, Events, and Lost & Found.
* Admin users have extended privileges for Clubs and Events management.

## Contributing

* Contributions are welcome! Please fork the repo and create pull requests.

## License

* MIT License

```


