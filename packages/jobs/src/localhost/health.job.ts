tocsin.monitor("Localhost", {
  cron: "*/2 * * * * *",
  task: async () => {
    const response = await tocsin.http.get("http://localhost:8000/");
    if (response.statusCode !== 200) throw new Error(response.statusMessage);
  },
});
