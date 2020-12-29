import { SLACK_DEFAULT_CHANNEL, SLACK_HOOK_URL } from "../config";
import { http } from "@tocsin/common";
import { intervalToDuration, formatDuration } from "date-fns";

const emoji = {
  scared: "https://i.imgur.com/5TCUMmV.png",
  laughing: "https://i.imgur.com/G78oyKE.png",
  like: "https://i.imgur.com/o9DajY9.png",
};

interface ISlackOpts {
  channel?: SlackChannelName;
}

export async function failure(
  namespace: string,
  jobName: string,
  event: IWorkerFailureEvent,
  opts: ISlackOpts = {}
) {
  /**
   * This destructuring with the string template requires typescript@next, to
   * avoid blowing the call stack.
   * https://github.com/microsoft/TypeScript/issues/41651
   *
   * TODO: install 4.2.0 when it is officially released in feb/mar.
   */
  const { channel = SLACK_DEFAULT_CHANNEL }: ISlackOpts = opts as ISlackOpts;

  const totalDuration = intervalToDuration({
    start: event.failingSince,
    end: new Date(),
  });
  const failingSinceUnixTimestamp = Math.round(+event.failingSince / 1000);

  await http.post(SLACK_HOOK_URL, {
    channel: channel,
    icon_url: emoji.scared,
    username: "chime-bot",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:fire: Failure: [${namespace}] ${jobName}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Status:* Failed",
          },
          {
            type: "mrkdwn",
            text: `*Namespace:* ${namespace}`,
          },
          {
            type: "mrkdwn",
            text: `*Since:* <!date^${failingSinceUnixTimestamp}^{date_short_pretty} {time}|${event.failingSince.toISOString()}>`,
          },
          {
            type: "mrkdwn",
            text: `*Job:* ${jobName}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Failing for:* ${formatDuration(totalDuration)}`,
          },
        ],
      },
    ],
  });
}

export async function recovered(
  namespace: string,
  jobName: string,
  event: IWorkerRecoveryEvent,
  opts: ISlackOpts = {}
) {
  const { channel = SLACK_DEFAULT_CHANNEL }: ISlackOpts = opts as ISlackOpts;
  const totalDuration = intervalToDuration({
    start: event.failingSince,
    end: event.recoveredAt,
  });
  const recoveredAtUnixTimestamp = Math.round(+event.recoveredAt / 1000);

  await http.post(SLACK_HOOK_URL, {
    channel: channel,
    icon_url: emoji.laughing,
    username: "chime-bot",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:white_check_mark: Recovered: [${namespace}] ${jobName}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Status:* Recovered",
          },
          {
            type: "mrkdwn",
            text: `*Namespace:* ${namespace}`,
          },
          {
            type: "mrkdwn",
            text: `*Recovered At:* <!date^${recoveredAtUnixTimestamp}^{date_short_pretty} {time}|${event.recoveredAt.toISOString()}>`,
          },
          {
            type: "mrkdwn",
            text: `*Job:* ${jobName}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Total duration:* ${formatDuration(totalDuration)}`,
          },
        ],
      },
    ],
  });
}

export async function registered(
  namespace: string,
  jobName: string,
  event: IWorkerRegistrationEvent,
  opts: ISlackOpts = {}
) {
  const { channel = SLACK_DEFAULT_CHANNEL }: ISlackOpts = opts as ISlackOpts;
  const nextRunTimeStamp = Math.round(+event.nextRun / 1000);

  await http.post(SLACK_HOOK_URL, {
    channel: channel,
    icon_url: emoji.like,
    username: "chime-bot",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:large_blue_circle: Registered: [${namespace}] ${jobName}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Status:* Registered",
          },
          {
            type: "mrkdwn",
            text: `*Namespace:* ${namespace}`,
          },
          {
            type: "mrkdwn",
            text: `*Next run:* <!date^${nextRunTimeStamp}^{date_short_pretty} {time}|${event.nextRun.toISOString()}>`,
          },
          {
            type: "mrkdwn",
            text: `*Job:* ${jobName}`,
          },
        ],
      },
    ],
  });
}
