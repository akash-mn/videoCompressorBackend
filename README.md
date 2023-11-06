# Video Compression and File Reading Backend

This web application serves as the backend for a system that allows users to compress video files and read files from the server. It is built using Node.js, Express, Socket.io, and MongoDB. Below are instructions on how to set up and run this application locally.

## Prerequisites

Before getting started, make sure you have the following software and tools installed on your computer:

- [Node.js](https://nodejs.org/): You'll need Node.js to run the application.

## Using MongoDB Atlas for Cloud Storage

This project uses MongoDB Atlas, a cloud database service, to store and manage data. To set up MongoDB Atlas for your project, follow these steps:

1. **Create a MongoDB Atlas Account:** If you don't already have an account, sign up for MongoDB Atlas at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).

2. **Create a Cluster:** After signing in to your MongoDB Atlas account, create a new cluster to store your project's data. Follow the MongoDB Atlas documentation for guidance on creating a cluster.

3. **Get Connection String:** Obtain the connection string for your cluster. This string will be used in your project's environment variables. Make sure you have a secure connection string that includes a username and password.

4. **Configure .env File:** In your project's root directory, create a `.env` file if you haven't already. Add the following environment variable to the file and set it to your MongoDB Atlas connection string:

   ```plaintext
   MONGO_URL=your_mongodb_atlas_connection_string

Getting Started

1.Clone the repository to your local machine using Git:
git clone https://github.com/akash-mn/videoCompressorBackend.git
cd videoCompressorBackend

2.Install the project dependencies using npm:
npm install

3.Create a`.env`file in the project root directory to store environment variables. Add the following variables and configure them with your settings:
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_Secret="mysecrettoken"

4.To start the application, use the following command:
npm start
The application will be accessible at http://localhost:5000.

Usage

1.Visit http://localhost:5000 to access the backend of the application.
2.You can integrate this backend with a front-end application for video compression and file reading.

Star this Project

If you find this project helpful or interesting, please consider giving it a star on GitHub. Your support is greatly appreciated!
