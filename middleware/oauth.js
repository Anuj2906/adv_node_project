import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Loads client secrets from client_secret json file
const CLIENT_SECRET_PATH = path.join(process.cwd(), 'client_secret_1033850522260-o458278ua50bmujcpsi8pqfsbsemvia2.apps.googleusercontent.com.json');
const credentials = JSON.parse(readFileSync(CLIENT_SECRET_PATH, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const scopes = ['openid', 'profile', 'email'];
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to initiate Google OAuth 2.0 authentication
export const googleAuth = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(authUrl);
};

// Middleware to handle the callback from Google
export const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }
  console.log(code);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Retrieve user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });
    console.log(oauth2);
    const userinfo = await oauth2.userinfo.get();
    req.session.user = userinfo.data;
    console.log(userinfo);
    const token = jwt.sign(userinfo.data, JWT_SECRET);
    console.log(token);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/'); // Redirects to the desired route after successful authentication
  } catch (error) {
    console.error('Error during authentication', error);
    res.status(500).send('Authentication failed');
  }
};

// Middleware to verify JWT and authenticate the user
export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
 console.log(token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};
