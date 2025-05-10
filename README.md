# Video Upload and Admin Panel API

## Overview

This project is a backend-only RESTful API for managing a video upload platform. It supports multiple user roles (Admin, Artist, Viewer) and allows Artists to upload videos (with thumbnails), which Admins can then approve or reject. All video metadata is stored in a local JSON file, and video assets are uploaded to Cloudinary.

## Features

* JWT-based user authentication and role-based access control
* Artist-specific video upload and management
* Cloudinary integration for video and thumbnail file hosting
* Admin approval/rejection of uploaded videos
* JSON-based local storage for video metadata
* Support for soft reject and soft approval of videos

## Technologies Used

* Node.js + Express.js
* Cloudinary SDK
* Multer for file uploads
* JWT for authentication
* JSON file as local storage

---

## API Endpoints

### Public Routes

* `GET /videos/all` — Fetch all videos
* `GET /videos/approved` — Fetch all approved videos

### Artist Routes (Authenticated)

* `POST /videos/upload` — Upload a video with a thumbnail
* `PUT /videos/update/:id` — Update video details
* `DELETE /videos/delete/:id` — Delete a video

### Admin Routes (Authenticated as Admin)

* `POST /videos/approve/:id` — Approve a video
* `POST /videos/reject/:id` — Soft reject a video

---

## Video Upload Flow

1. **Artist logs in** and receives a JWT token.
2. **Artist uploads** a video file and thumbnail using the `/upload` endpoint.
3. Files are **uploaded to Cloudinary**, and the returned URLs are stored.
4. Metadata is saved in `video.model.json`.
5. Admin manually approves/rejects videos.

---

## Sample Video JSON Structure

```json
{
  "id": 1746859598046,
  "owner": 1746857315996,
  "title": "abc",
  "description": "example",
  "videoFile": "https://res.cloudinary.com/../video.mp4",
  "thumbnailFile": "https://res.cloudinary.com/../thumb.jpg",
  "category": "comedy",
  "genre": "all",
  "version": "2",
  "createdAt": "2025-05-10T06:46:38.046Z",
  "approved": false
}
```

---

## Example Upload Request (POST /videos/upload)

Content-Type: `multipart/form-data`

Form Fields:

* `videoFile`: Video file
* `thumbnailFile`: Thumbnail image
* `title`, `description`, `category`, `genre`, `version`

---

## Admin Actions

### Approve Video

```js
video.approved = true;
saveData("video.model.json", videos);
```

### Soft Reject Video

```js
video.approved = false;
saveData("video.model.json", videos);
```

---

## Helper Functions

### `uploadOnCloudinary(file)`

Uploads to Cloudinary and returns a public URL.

### `deleteOnCloudinary(cloudUrl)`

Removes a file from Cloudinary using its URL.

### `loadData(filename)` / `saveData(filename, data)`

Used for interacting with local JSON files.

---

## Notes

* `video.model.json` must always store data as an array.
* Make sure to handle form-data correctly in your frontend.
* Only approved videos are shown to viewers.

---

## Todo / Improvements

* Switch from JSON file to MongoDB/PostgreSQL for production
* Add user registration/login endpoints
* Pagination and search for video listings
* Unit tests and Swagger documentation

---

## License

MIT License

---

## Author

This project was developed as part of a backend assignment.

Feel free to modify and extend it as needed!
