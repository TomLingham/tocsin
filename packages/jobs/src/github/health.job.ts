tocsin.monitor("GitHub monitor", {
  cron: "*/10 * * * * *",
  task: async () => {
    const result = await tocsin.http.get("https://github.com/");

    if (result.statusCode !== 200)
      throw new Error(
        `Github returned a non-200 status code. Received ${result.statusCode}`
      );
  },
});
