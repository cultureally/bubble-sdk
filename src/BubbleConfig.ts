const DEFAULT_CONFIG: Pick<IBubbleConfig, "domain" | "apiVersion"> = {
  domain: "bubbleapps.io",
  apiVersion: "1.1",
};

export class NotIntializedError extends Error {
  message =
    "Must initialize bubble-sdk with BubbleConfig.set before you make any API requests.";
}

export interface IBubbleConfig {
  app: string;
  appVersion?: string;
  apiKey: string;

  domain: string;
  apiVersion: string;
}

type SetConfig = Pick<IBubbleConfig, "app" | "appVersion" | "apiKey"> &
  Partial<Pick<IBubbleConfig, "domain" | "apiVersion">>;

let config: IBubbleConfig | null = null;

export default class BubbleConfig {
  static get(): IBubbleConfig {
    if (!config) {
      throw new NotIntializedError();
    }
    return config;
  }

  static set(setConfig: SetConfig) {
    config = {
      ...DEFAULT_CONFIG,
      ...setConfig,
    };
  }

  static reset() {
    config = null;
  }

  /** Base URL for bubble API */
  static get baseUrl(): string {
    const { app, appVersion, domain, apiVersion } = BubbleConfig.get();
    const versionPart = appVersion ? `/${appVersion}` : "";
    return `https://${app}.${domain}${versionPart}/api/${apiVersion}`;
  }

  /** Request headers for all Bubble requests */
  static get headers(): { Authorization: string } {
    const { apiKey } = BubbleConfig.get();
    return {
      Authorization: `Bearer ${apiKey}`,
    };
  }
}
