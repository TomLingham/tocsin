import https from "https";

monitor("GitHub monitor", {
  cron: "*/10 * * * * *",
  task: async () => {
    return new Promise((resolve, reject) => {
      https.get("https://github.com/", (res) => {
        if (res.statusCode != 200) reject(new Error(res.statusMessage));
        else resolve();
      });
    });
  },
});
