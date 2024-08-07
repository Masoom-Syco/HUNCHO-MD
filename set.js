const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYU9QOFlmUGpKZVdvby9qOGx1MVE1OGZRUDRsRU5vN2VsemJVYkE5ZzZHST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQTh0NHdDOERSNGdRenVvQzlKMEVsMmpwbUxLdXV1dTZYemhIekVnM2xrcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpSkpmSTJkRDNRS1JhZHVjNnIvT1QzaVhGb2FJWUlDbEJsZmlGaDJjRkhRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHcDlJU3E4ZUkvQU1UR1BxQmYzYUNmNXNzMWQrcEhIR3ovWW5TY1JsWERZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFPemEvNmYzdVdjamhZbVFnMTRCQUxGZU0ySWZ2cTIzMGdVNEVLTXhVbkU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVkNExEa0VIZXBZZWJ6bDRIOTVya3BWL0hiME4ydzU1aHJkbHdLdWpZbEE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUNSYWpSV2hrQUlidGI5SnVyWDRRcWhoRTFHalhUYUVURTNLOXFlRVNVOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaHU4MlBrdHZFSzZVblVJVkppb0JrNG5zRmxLdWxndEo5eGtWcXRQQXlVUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJoVjJ5S3N3dWNBRjV2d0Q0NTYxS3pKODcvMTQvSnRpclMzekRpaitkbkdCSXZGUThKbWsvdE1waUZoZjlCb1hPeXhkS0lIanIwT3ZEam1XaFZBemlnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjA4LCJhZHZTZWNyZXRLZXkiOiIvV1B4N0pvOU1DYThMQVk1V2F1NktGT2VYN3d6c3U2eVJNeldyb3pBSjQwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJHdTBKRzc0N1RCU011NmFQMjFhcUdBIiwicGhvbmVJZCI6IjkwMDNhYTRhLTJmYzYtNDdjYi04ZmZjLTBmNDlmNWUyZDNhNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSSnhaVUhwcmtEOXFDSHVJMnNnVmdPWk1ENWs9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWm5ISjAvNHBKUHRZSGY5aE90RmZCMnhkaUJjPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkY3QjVOMlBUIiwibWUiOnsiaWQiOiI5MjM0MzEwNjk3NjE6MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJNYXNvb20uYmFjaGEucmVhbC52b2ljZSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTUNaMmZFR0VNVC96clVHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiR3NncG5memdYeGx0MlJNYkZwQmxxcXR5MjBSLzNPRTViWEZXUVJnVXloUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiWXBKWVVyaFF2R01rTVpCOTlMRjJVcWVnSlpkN1dGcGFnMHBhNVBwZHM1eE1rL2lhd1dhU2dlQkI0T3ZDOVB2aHg2UEZVeFVIeGdDWjBxZTdLRzMvREE9PSIsImRldmljZVNpZ25hdHVyZSI6IkRnMUdNMXJKZVFPWS9iTUVoR1ozOExuVlgyOXBTU2lQZVRMb1BKWUxsWExlZjMvVlljQTdJNTA4ZGNGSVVYY3hmbkJINTJtUmxiRlZwL2JUZmcxeWlRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzNDMxMDY5NzYxOjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUnJJS1ozODRGOFpiZGtUR3hhUVphcXJjdHRFZjl6aE9XMXhWa0VZRk1vVSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMzA1NjA4NSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFJNXcifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Maͥsoͣoͫm Bacha",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "923431069761",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Maͥsoͣoͫm Bacha',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/e18441d126f37be8efbfa.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
