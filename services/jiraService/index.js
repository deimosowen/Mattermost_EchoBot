const { getTask, changeStatus, addComment } = require('../../jira');
const { JIRA_BOT_USERNAME, JIRA_BOT_PASSWORD } = require('../../config');

class JiraService {
    constructor() {
        this.authHeader = `Basic ${btoa(`${JIRA_BOT_USERNAME}:${JIRA_BOT_PASSWORD}`)}`;
    }

    async fetchTask(taskKey) {
        return await getTask(taskKey, this.authHeader);
    }

    async changeTaskStatus(taskKey, status) {
        return await changeStatus(taskKey, status, this.authHeader);
    }

    async addComment(taskKey, comment) {
        return await addComment(taskKey, comment, this.authHeader);
    }
}

module.exports = new JiraService();