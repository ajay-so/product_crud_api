const fs = require("fs");
const path = require("path");

const ensureLogFolderExists = () => {
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
};

const getTodayLogFile = () => {
  const today = new Date().toISOString().split("T")[0];
  return path.join(__dirname, `../logs/${today}.log`);
};

const logger = ({
  action,
  timestamp = new Date().toLocaleString(),
  api,
  method,
  ip,
  userEmail = "Guest",
  duration,
  input,
  output,
  error,
}) => {
  ensureLogFolderExists();
  const filePath = getTodayLogFile();

  const logEntry =
  `------------------------------------------------\n` +
    `Timestamp: ${timestamp}\n` +
    `Action: ${action}\n` +
    `API: ${api}\n` +
    `Method: ${method}\n` +
    `IP: ${ip}\n` +
    `User: ${userEmail}\n` +
    `Duration: ${duration}ms\n` +
    `Input: ${JSON.stringify(input)}\n` +
    `Output: ${JSON.stringify(output)}\n` +
    `Error: ${error}\n`+
    `------------------------------------------------\n`;

    fs.appendFileSync(filePath, logEntry, "utf8");
};

module.exports = logger;
