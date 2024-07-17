const fs = require("fs");
const path = require("path");

const readJsonFile = (directory, fileName) => {
  const filePath = path.join(__dirname, "data", directory, fileName);
  const fileData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileData);
};

const prepareData = (directory) => {
  const is3D = directory === "3D" ? "3D" : "";
  const points = readJsonFile(directory, `Point${is3D}.json`);
  const rects = readJsonFile(directory, `Rect${is3D}.json`);
  const data = points.concat(rects);
  data.sort((a, b) => a.ts - b.ts);
  return data;
};

const handleWebSocketConnection = (ws, data) => {
  console.log("WebSocket Client connected");

  data.forEach((item) => {
    setTimeout(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(item), (err) => {
          if (err) {
            console.error("Send error:", err);
          }
        });
      } else {
        console.log("WebSocket is not open. Data not sent.");
      }
    }, item.ts * 1000); /* Ben or Aviad in setTimeout we usually use milliseconds, if you want to see it moving quickly just remove the * 1000  */
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

module.exports = {
  prepareData,
  handleWebSocketConnection,
};
