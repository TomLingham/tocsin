/// <reference path="./typings/events.d.ts" />
/// <reference path="./typings/resources/jobs.d.ts" />

declare type SlackChannelName = `#${string}` | `@${string}`;

declare interface IMonitorOpts {
  channel?: SlackChannelName;
  cron: string;
  task: () => void;
}

declare namespace tocsin {
  declare const monitor: typeof import("./module/types").monitor;
  declare const http: typeof import("@tocsin/http");
}
