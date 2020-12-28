import * as jobs from "..";
import { __http_mock } from "http";
import { __https_mock } from "https";
import { __fs_mock } from "fs/promises";

jest.mock("http");
jest.mock("https");
jest.mock("fs/promises");

describe(jobs.getJobDefinitions, () => {
  it("should load the file from the filesystem", async () => {
    __fs_mock.setData(Buffer.from("{}"));
    const res = await jobs.getJobDefinitions("./some/file.json");
    expect(res).toEqual({});
  });

  it("should load the file over http", async () => {
    __http_mock.setData("{}");

    const res = await jobs.getJobDefinitions("http://url.dev/jobs.json");
    expect(res).toEqual({});
  });

  it("should load the file over https", async () => {
    __https_mock.setData("{}");

    const res = await jobs.getJobDefinitions("https://url.dev/jobs.json");

    expect(res).toEqual({});
  });
});

describe(jobs.resolveJobResources, () => {
  it("is a test", async () => {
    __http_mock.setData('console.log("foobar");');

    const result = await jobs.resolveJobResources({
      "name/space1": "http://someurl1.dev/jobs.json",
      "name/space2": "http://someurl2.dev/jobs.json",
      "name/space3": "http://someurl3.dev/jobs.json",
    });

    console.log(result);
  });
});
