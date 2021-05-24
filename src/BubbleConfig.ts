const DEFAULT_CONFIG: Pick<IBubbleConfig, "domain" | "apiVersion"> = {
  domain: "bubbleapps.io",
  apiVersion: "1.1",
};

export class NotIntializedError extends Error {
  message =
    "Must initialize bubble-sdk with BubbleConfig.set before you make any API requests.";
}

interface IBubbleConfig {
  app: string;
  appVersion?: string;
  apiKey: string;

  domain: string;
  apiVersion: string;
}

type SetConfig = Pick<IBubbleConfig, "app" | "appVersion" | "apiKey"> &
  Partial<Pick<IBubbleConfig, "domain" | "apiVersion">>;

class BubbleConfigManager {
  config: IBubbleConfig | null = null;

  get(): IBubbleConfig {
    if (!this.config) {
      throw new NotIntializedError();
    }
    return this.config;
  }

  set(config: SetConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  reset() {
    this.config = null;
  }

  /** Base URL for bubble API */
  get baseUrl(): string {
    const { app, appVersion, domain, apiVersion } = this.get();
    const versionPart = appVersion ? `/${appVersion}` : "";
    return `https://${app}.${domain}${versionPart}/api/${apiVersion}`;
  }

  /** Request headers for all Bubble requests */
  get headers(): { Authorization: string } {
    const { apiKey } = this.get();
    return {
      Authorization: `Bearer ${apiKey}`,
    };
  }
}

const BubbleConfig = new BubbleConfigManager();
export default BubbleConfig;
