const express = require('express');
const { updateUser } = require('../../db/models/calendars');
const { createOAuth2Client, invalidateOAuth2ClientForUser } = require('../googleAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('https://github.com/deimosowen/Mattermost_CaseOneBot');
});

router.get('/PrivacyPolicy', (req, res) => {
    res.redirect('https://github.com/deimosowen/Mattermost_CaseOneBot/blob/main/PrivacyPolicy.md');
});

router.get('/googleAuthCallback', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).send('Bad Request: Missing required parameters.');
        }

        const userOAuth2Client = await createOAuth2Client();

        const decodedState = decodeURIComponent(state);
        const { channel_id, user_id } = JSON.parse(decodedState);
        const { tokens } = await userOAuth2Client.getToken(code);
        await updateUser(user_id, channel_id, tokens);
        invalidateOAuth2ClientForUser(user_id);

        res.render('googleAuthCallback', { user_id });
    } catch (error) {
        return res.status(500).send('Bad Request: Something went wrong.');
    }
});


module.exports = router;