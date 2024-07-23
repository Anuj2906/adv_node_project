import express from 'express';
import { googleAuth, googleAuthCallback, authenticate } from '../middleware/oauth.js';
import { createCustomer, saveUserInfo, getAllUsers, getAggregatedResult } from '../controller.js/customerController.js';

const router = express.Router();

// Route to initiate Google OAuth 2.0 authentication
router.get('/auth/google', googleAuth);

// Route to handle the callback from Google
router.get('/oauth-redirecturi', googleAuthCallback);

router.get('/', (req, res) => {
    console.log({"foo" : "bar"});
    // saveUserInfo(req, res);
    res.send(req.session.user);
})

router.post('/db-save', authenticate, createCustomer);
router.get('/all-users',getAllUsers)
router.get('/aggregation', getAggregatedResult)

export default router;

