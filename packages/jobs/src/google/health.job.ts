import { http } from "@tocsin/common";

monitor("Google homepage", {
  cron: "*/10 * * * * *",
  task: async () => {
    const response = await http.get("https://www.google.com/");
    if (response.statusCode !== 200) throw new Error(response.statusMessage);

    const match = response.body.match(/<title>(.*)<\/title>/);
    if (match == null) throw new Error("Invalid page title");

    if (match[1] !== "Google")
      throw new Error(`Invalid page title ${match[1]}`);
  },
});

monitor("About Google", {
  cron: "*/15 * * * * *",
  task: async () => {
    const response = await http.get("https://about.google/");
    if (response.statusCode !== 200) throw new Error(response.statusMessage);
  },
});
