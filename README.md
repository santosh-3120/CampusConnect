
# **CampusConnect Hub**

**CampusConnect Hub** is a full-stack web application designed for campus communities to connect, share, and manage campus-related activities. It provides modules for **Marketplace, Clubs, Events, Lost & Found, and Messages**, making campus life more interactive and organized.

**Live Demo**  

**Frontend:** [CampusConnect Hub](https://campusconnecthub.onrender.com)  
**Backend API:** [CampusConnect Backend](https://campusconnect-bcew.onrender.com)

---

## **Features**

### **1. Marketplace**
- Users can **buy and sell items** by providing details like price, description, and images.  
- Multiple **search and filter options** available: maximum price, minimum price, type, etc.  
- Sellers can create items with images, which are uploaded to **Cloudinary** for storage.  

### **2. Clubs**
- Only users with the **admin role** can create clubs and manage followers.  
- **Club messages** can only be sent by admins; followers can view club messages.  
- Club information (**name, description, logo**) is visible to all users, but messages are restricted to followers.  
- Club logos are uploaded to **Cloudinary**.  

### **3. Events**
- **Admins** can create events with images, location, and date.  
- When an event is created, a **notification email** is sent to all users in the database using **Nodemailer**.  
- Users can **RSVP** to events.  
- Events can be **searched** by location or event name.  

### **4. Lost & Found**
- Users can **report lost or found items** on campus.  
- Details include **handover location** and the **person the item was handed to**.  
- Any user can **claim an item**, and claimed items are marked appropriately.  

### **5. Messages**
- Users can **chat with each other in real-time**, fostering direct communication within the campus community.  
- Messages are powered by **Socket.IO** for seamless, real-time interactions.  

---

## **Tech Stack**

- **Frontend:** React, Tailwind CSS, Nginx  
- **Backend:** Node.js, Express.js, MongoDB  
- **Authentication & Authorization:** JWT, Role-based access  
- **File Storage:** Cloudinary for images (Marketplace and Clubs)  
- **Email Notifications:** Nodemailer  
- **Real-time Communication:** Socket.IO for club messages and user-to-user messaging  

---

## **Setup Instructions**

### **Backend**

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
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
PORT=3000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
EMAIL_USER=your_email_here
EMAIL_PASS=your_email_password_here  # Use App Password if 2FA is enabled
```

4. Start the backend server:

```bash
npm start
```

---

### **Frontend**

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

---

## **Docker Deployment**

* Deploy using **Docker** for both backend and frontend.
* Use **docker-compose** or individual Dockerfiles to build and run containers.
* **Nginx** handles frontend routing and proxies API and Socket.IO requests to the backend.

---

## **Usage**

* Access the app via the frontend URL.
* Sign up or log in to interact with **Marketplace, Clubs, Events, Lost & Found, and Messages**.
* **Admin users** have extended privileges for managing Clubs and Events.

---

## **Contributing**

* Contributions are welcome! Fork the repo and submit pull requests.

---

## **License**

* MIT License


