const express = require('express');
const { updateUser, getUserSettings, updateUserSettings } = require('../db/models/calendars');
const { oAuth2Client } = require('./googleAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('https://github.com/deimosowen/Mattermost_EchoBot');
});

router.get('/googleAuthCallback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send('Bad Request: Missing required parameters.');
    }

    const decodedState = decodeURIComponent(state);
    const { channel_id, user_id } = JSON.parse(decodedState);
    const { tokens } = await oAuth2Client.getToken(code);
    await updateUser(user_id, channel_id, tokens);

    res.send(`
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                    color: #333;
                }
                #message {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                h1 {
                    color: #007bff;
                    font-size: 2.5em;
                }
                p {
                    color: #666;
                    font-size: 1.2em;
                }
                .integration {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="integration">
                <!-- SVG код для иконки Google Calendar -->
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" data-name="Layer 1" viewBox="0 0 32 32" id="google-calendar"><path fill="#4285f4" d="M22,4.5v6H10v11H4V6.5a2.0059,2.0059,0,0,1,2-2Z"></path><polygon fill="#ea4435" points="22 27.5 22 21.5 28 21.5 22 27.5"></polygon><rect width="6" height="12" x="22" y="9.5" fill="#ffba00"></rect><rect width="6" height="12" x="13" y="18.5" fill="#00ac47" transform="rotate(90 16 24.5)"></rect><path fill="#0066da" d="M28,6.5v4H22v-6h4A2.0059,2.0059,0,0,1,28,6.5Z"></path><path fill="#188038" d="M10,21.5v6H6a2.0059,2.0059,0,0,1-2-2v-4Z"></path><path fill="#4285f4" d="M15.69,17.09c0,.89-.66,1.79-2.15,1.79a3.0026,3.0026,0,0,1-1.52-.39l-.08-.06.29-.82.13.08a2.3554,2.3554,0,0,0,1.17.34,1.191,1.191,0,0,0,.88-.31.8586.8586,0,0,0,.25-.65c-.01-.73-.68-.99-1.31-.99h-.54v-.81h.54c.45,0,1.12-.22,1.12-.82,0-.45-.31-.71-.85-.71a1.8865,1.8865,0,0,0-1.04.34l-.14.1-.28-.79.07-.06a2.834,2.834,0,0,1,1.53-.45c1.19,0,1.72.73,1.72,1.45a1.4369,1.4369,0,0,1-.81,1.3A1.52,1.52,0,0,1,15.69,17.09Z"></path><polygon fill="#4285f4" points="18.71 12.98 18.71 18.79 17.73 18.79 17.73 14 16.79 14.51 16.58 13.69 17.95 12.98 18.71 12.98"></polygon></svg>
                <!-- SVG код для стрелки -->
                <svg fill="#000000" height="32" width="32" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
<polygon points="315.1,48.6 196.9,48.6 354.5,206.1 0,206.1 0,284.9 354.5,284.9 196.9,442.4 315.1,442.4 512,245.5 "/>
</svg>
                <!-- SVG код для иконки Mattermost -->
                <svg fill="#000000" width="50" height="50" viewBox="0 0 501 501" xmlns="http://www.w3.org/2000/svg" version="1"><path d="M236 .7C137.7 7.5 54 68.2 18.2 158.5c-32 81-19.6 172.8 33 242.5 39.8 53 97.2 87 164.3 97 16.5 2.7 48 3.2 63.5 1.2 48.7-6.3 92.2-24.6 129-54.2 13-10.5 33-31.2 42.2-43.7 26.4-35.5 42.8-75.8 49-120.3 1.6-12.3 1.6-48.7 0-61-4-28.3-12-54.8-24.2-79.5-12.8-26-26.5-45.3-46.8-65.8C417.8 64 400.2 49 398.4 49c-.6 0-.4 10.5.3 26l1.3 26 7 8.7c19 23.7 32.8 53.5 38.2 83 2.5 14 3 43 1 55.8-4.5 27.8-15.2 54-31 76.5-8.6 12.2-28 31.6-40.2 40.2-24 17-50 27.6-80 33-10 1.8-49 1.8-59 0-43-7.7-78.8-26-107.2-54.8-29.3-29.7-46.5-64-52.4-104.4-2-14-1.5-42 1-55C90 121.4 132 72 192 49.7c8-3 18.4-5.8 29.5-8.2 1.7-.4 34.4-38 35.3-40.6.3-1-10.2-1-20.8-.4z"/><path d="M322.2 24.6c-1.3.8-8.4 9.3-16 18.7-7.4 9.5-22.4 28-33.2 41.2-51 62.2-66 81.6-70.6 91-6 12-8.4 21-9 33-1.2 19.8 5 36 19 50C222 268 230 273 243 277.2c9 3 10.4 3.2 24 3.2 13.8 0 15 0 22.6-3 23.2-9 39-28.4 45-55.7 2-8.2 2-28.7.4-79.7l-2-72c-1-36.8-1.4-41.8-3-44-2-3-4.8-3.6-7.8-1.4z"/></svg>
            </div>
            <div id="message">
                <h1>Аутентификация успешно завершена!</h1>
                <p>Вы можете закрыть это окно и вернуться в Mattermost.</p>
                <p>Также, вы можете <a href="/calendar/settings/?user_id=${user_id}">перейти к настройкам уведомлений о событиях календаря</a>.</p>
            </div>
        </body>
    </html>
    `);
});

router.post('/notifications', (req, res) => {
    const notification = req.body;

    console.log(notification);

    res.sendStatus(200);
});

/* Settings */
router.get('/calendar/settings/', async (req, res) => {
    const { user_id, success } = req.query;

    const settings = await getUserSettings(user_id);

    if (!settings) {
        return res.status(400).send('Bad Request: Not found user.');
    }

    const successMessage = success ? '<p style="color: green; font-size: 18px; text-align: center;">Настройки успешно сохранены!</p>' : '';
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 400px;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                }
                h1 {
                    font-size: 26px;
                    margin-bottom: 20px;
                    color: #333;
                    text-align: center;
                }
                form {
                    display: flex;
                    flex-direction: column;
                }
                label {
                    font-weight: 500;
                    margin-bottom: 10px;
                    color: #333;
                }
                select {
                    margin-bottom: 30px;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    color: #333;
                }
                input[type="submit"] {
                    background-color: #007AFF;
                    color: white;
                    padding: 15px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                }
                input[type="submit"]:hover {
                    background-color: #0051cb;
                }               
                .checkbox-label {
                    display: flex;
                    align-items: center;
                }
                .checkbox-label input[type="checkbox"] {
                    margin-left: 10px;
                    accent-color: #007AFF;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Настройки Календаря</h1>
                ${successMessage}
                <form action="/calendar/settings/" method="post">
                    <input type="hidden" id="user_id" name="user_id" value="${user_id}">
                    <label class="checkbox-label">
                        Включить уведомления
                        <input type="checkbox" id="is_notification" name="is_notification" value="1" ${settings.is_notification ? 'checked' : ''}>
                    </label>
                    <label for="notification_interval">Уведомлять меня:</label>
                    <select id="notification_interval" name="notification_interval">
                        <option value="10" ${settings.notification_interval === 10 ? 'selected' : ''}>За 10 минут до начала события</option>
                        <option value="5" ${settings.notification_interval === 5 ? 'selected' : ''}>За 5 минут до начала события</option>
                        <option value="1" ${settings.notification_interval === 1 ? 'selected' : ''}>За 1 минуту до начала события</option>
                    </select>
                    <input type="submit" value="Сохранить">
                </form>
            </div>
        </body>
        </html>
    `);
});

router.post('/calendar/settings/', async (req, res) => {
    let { user_id, notification_interval, is_notification } = req.body;
    is_notification = parseInt(is_notification) || 0;
    await updateUserSettings(user_id, { notification_interval, is_notification });
    res.redirect(`/calendar/settings/?user_id=${user_id}&success=true`);
});

module.exports = router;