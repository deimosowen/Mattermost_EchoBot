const { postMessage } = require('../../mattermost/utils');

module.exports = async ({ channel_id }) => {
    const message = `
**Список доступных команд для дежурства:**

- \`!duty ; cron-расписание ; список-пользователей\` : Устанавливает график дежурства. Список пользователей должен быть разделен запятыми.
   Пример: \`!duty-set ; 0 9 * * 1-5 ; alice,bob,charlie\`

- \`!duty-remove\` : Удаляет график дежурства для текущего канала.

- \`!duty-current\` : Показывает текущего дежурного в канале.

- \`!duty-next\` : Переключает на следующего дежурного в канале.

- \`!duty-help\` : Показывает это сообщение о помощи.

**Подсказка о cron-расписании:**

Cron-расписание состоит из 5 полей, разделенных пробелами, которые обозначают следующее (в порядке следования):

1. Минуты (0 - 59)
2. Часы (0 - 23, UTC)
3. Дни месяца (1 - 31)
4. Месяцы (1 - 12)
5. Дни недели (0 - 7, где 0 и 7 - воскресенье)

Asterisk (\\*) в поле означает "любое значение". Например, запись \`* * * * *\` означает "каждую минуту каждого часа каждого дня".`;

    postMessage(channel_id, message);
};
