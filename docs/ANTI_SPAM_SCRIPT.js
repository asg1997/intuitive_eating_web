// Улучшенный Google Apps Script с защитой от спама
// Замените содержимое вашего скрипта на этот код

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Получаем данные
        const email = e.parameter.email;
        const timestamp = e.parameter.timestamp || new Date().toISOString();
        const source = e.parameter.source || 'unknown';
        const userAgent = e.parameter.userAgent || 'unknown';
        const ipAddress = e.parameter.ipAddress || 'unknown';

        // Проверка обязательных полей
        if (!email || email.trim() === '') {
            return createResponse('error', 'Email is required');
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return createResponse('error', 'Invalid email format');
        }

        // Проверка на подозрительные паттерны
        const suspiciousPatterns = [
            /test\d*@/i,           // test@, test1@, test123@
            /spam/i,               // содержит "spam"
            /fake/i,               // содержит "fake"
            /bot/i,                // содержит "bot"
            /admin@/i,             // admin@
            /noreply@/i,           // noreply@
            /no-reply@/i,          // no-reply@
            /temp@/i,              // temp@
            /temporary@/i          // temporary@
        ];

        for (let pattern of suspiciousPatterns) {
            if (pattern.test(email)) {
                logSuspiciousActivity(email, 'Suspicious email pattern', ipAddress);
                return createResponse('error', 'Invalid email');
            }
        }

        // Проверка на дубликаты
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === email) {
                return createResponse('duplicate', 'Email already subscribed');
            }
        }

        // Проверка частоты запросов с одного IP (последние 10 минут)
        const recentRequests = checkRecentRequests(ipAddress, 10); // 10 минут
        if (recentRequests >= 5) { // максимум 5 запросов за 10 минут
            logSuspiciousActivity(email, 'Too many requests from IP', ipAddress);
            return createResponse('error', 'Too many requests');
        }

        // Проверка домена email
        const emailDomain = email.split('@')[1];
        const suspiciousDomains = [
            '10minutemail.com',
            'tempmail.org',
            'guerrillamail.com',
            'mailinator.com',
            'yopmail.com'
        ];

        if (suspiciousDomains.includes(emailDomain.toLowerCase())) {
            logSuspiciousActivity(email, 'Suspicious email domain', ipAddress);
            return createResponse('error', 'Invalid email domain');
        }

        // Добавляем запись с дополнительными данными
        const rowData = [
            email,
            timestamp,
            source,
            ipAddress,
            userAgent,
            'normal' // статус: normal, suspicious, blocked
        ];

        sheet.appendRow(rowData);

        // Отправляем уведомление о новой подписке
        sendEmailNotification(email, timestamp, ipAddress);

        return createResponse('success', 'Email subscribed successfully', sheet.getLastRow());

    } catch (error) {
        Logger.log('Error: ' + error.toString());
        return createResponse('error', 'Internal server error');
    }
}

// Функция для создания ответа
function createResponse(result, message, data = null) {
    const response = { result: result, message: message };
    if (data) response.data = data;

    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

// Проверка недавних запросов с IP
function checkRecentRequests(ipAddress, minutesBack) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const cutoffTime = new Date(Date.now() - minutesBack * 60 * 1000);

    let count = 0;
    for (let i = 1; i < data.length; i++) {
        const rowTime = new Date(data[i][1]); // timestamp в колонке B
        const rowIP = data[i][3]; // IP в колонке D

        if (rowIP === ipAddress && rowTime > cutoffTime) {
            count++;
        }
    }

    return count;
}

// Логирование подозрительной активности
function logSuspiciousActivity(email, reason, ipAddress) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date().toISOString();

    // Добавляем в конец таблицы с пометкой "suspicious"
    sheet.appendRow([
        email,
        timestamp,
        'suspicious_activity',
        ipAddress,
        'unknown',
        'suspicious',
        reason // дополнительная колонка с причиной
    ]);

    // Отправляем уведомление о подозрительной активности
    sendSuspiciousActivityAlert(email, reason, ipAddress);
}

// Уведомление о новой подписке
function sendEmailNotification(email, timestamp, ipAddress) {
    const recipient = 'asg1997@yandex.ru'; // Ваш email
    const subject = '🎉 Новая подписка на рассылку!';
    const body = `
Новый подписчик:
Email: ${email}
Дата и время: ${new Date(timestamp).toLocaleString('ru-RU')}
IP-адрес: ${ipAddress}

Всего подписчиков: ${SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getLastRow() - 1}
`;

    try {
        MailApp.sendEmail(recipient, subject, body);
    } catch (error) {
        Logger.log('Failed to send email notification: ' + error.toString());
    }
}

// Уведомление о подозрительной активности
function sendSuspiciousActivityAlert(email, reason, ipAddress) {
    const recipient = 'asg1997@yandex.ru'; // Ваш email
    const subject = '⚠️ Подозрительная активность на сайте';
    const body = `
Обнаружена подозрительная активность:

Email: ${email}
Причина: ${reason}
IP-адрес: ${ipAddress}
Время: ${new Date().toLocaleString('ru-RU')}

Рекомендуется проверить логи.
`;

    try {
        MailApp.sendEmail(recipient, subject, body);
    } catch (error) {
        Logger.log('Failed to send suspicious activity alert: ' + error.toString());
    }
}

// Функция для анализа спама (можно запускать вручную)
function analyzeSpam() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    let stats = {
        total: 0,
        suspicious: 0,
        normal: 0,
        duplicates: 0,
        topDomains: {},
        topIPs: {}
    };

    const emails = new Set();

    for (let i = 1; i < data.length; i++) {
        const email = data[i][0];
        const status = data[i][5] || 'normal';
        const ip = data[i][3];
        const domain = email.split('@')[1];

        stats.total++;

        if (emails.has(email)) {
            stats.duplicates++;
        } else {
            emails.add(email);
        }

        if (status === 'suspicious') {
            stats.suspicious++;
        } else {
            stats.normal++;
        }

        // Подсчет доменов
        stats.topDomains[domain] = (stats.topDomains[domain] || 0) + 1;

        // Подсчет IP
        if (ip && ip !== 'unknown') {
            stats.topIPs[ip] = (stats.topIPs[ip] || 0) + 1;
        }
    }

    // Выводим статистику
    Logger.log('=== СТАТИСТИКА ПОДПИСОК ===');
    Logger.log(`Всего записей: ${stats.total}`);
    Logger.log(`Нормальных: ${stats.normal}`);
    Logger.log(`Подозрительных: ${stats.suspicious}`);
    Logger.log(`Дубликатов: ${stats.duplicates}`);

    Logger.log('\n=== ТОП-10 ДОМЕНОВ ===');
    const sortedDomains = Object.entries(stats.topDomains)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    sortedDomains.forEach(([domain, count]) => {
        Logger.log(`${domain}: ${count}`);
    });

    Logger.log('\n=== ТОП-10 IP АДРЕСОВ ===');
    const sortedIPs = Object.entries(stats.topIPs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    sortedIPs.forEach(([ip, count]) => {
        Logger.log(`${ip}: ${count}`);
    });

    return stats;
}

// Функция для очистки подозрительных записей
function cleanSuspiciousRecords() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    let deletedCount = 0;

    // Проходим с конца, чтобы не сбить индексы при удалении
    for (let i = data.length - 1; i >= 1; i--) {
        const status = data[i][5];
        if (status === 'suspicious') {
            sheet.deleteRow(i + 1); // +1 потому что индексы в Sheets начинаются с 1
            deletedCount++;
        }
    }

    Logger.log(`Удалено подозрительных записей: ${deletedCount}`);
    return deletedCount;
}
