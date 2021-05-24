import { ulid } from "ulid";
import { BubbleConfig } from "../src";
import { NotIntializedError } from "../src/BubbleConfig";

describe("BubbleConfig", () => {
  beforeEach(() => BubbleConfig.reset());

  test("defines baseUrl", () => {
    const config = {
      app: ulid(),
      apiKey: ulid(),
    };
    BubbleConfig.set(config);

    expect(BubbleConfig.baseUrl).toEqual(
      `https://${config.app}.bubbleapps.io/api/1.1`
    );
  });

  test("can define custom appVersion", () => {
    const config = {
      app: ulid(),
      apiKey: ulid(),
      appVersion: ulid(),
    };
    BubbleConfig.set(config);

    expect(BubbleConfig.baseUrl).toEqual(
      `https://${config.app}.bubbleapps.io/${config.appVersion}/api/1.1`
    );
  });

  test("can define custom domain", () => {
    const config = {
      app: ulid(),
      apiKey: ulid(),
      domain: ulid(),
    };
    BubbleConfig.set(config);

    expect(BubbleConfig.baseUrl).toEqual(
      `https://${config.app}.${config.domain}/api/1.1`
    );
  });

  test("can define custom apiVersion", () => {
    const config = {
      app: ulid(),
      apiKey: ulid(),
      apiVersion: ulid(),
    };
    BubbleConfig.set(config);

    expect(BubbleConfig.baseUrl).toEqual(
      `https://${config.app}.bubbleapps.io/api/${config.apiVersion}`
    );
  });

  test("defines headers with apiKey", () => {
    const config = {
      app: ulid(),
      apiKey: ulid(),
    };
    BubbleConfig.set(config);

    expect(BubbleConfig.headers).toEqual({
      Authorization: `Bearer ${config.apiKey}`,
    });
  });

  test("throws if not initialized", () => {
    expect(() => BubbleConfig.get()).toThrowError(NotIntializedError);
    expect(() => BubbleConfig.headers).toThrowError(NotIntializedError);
    expect(() => BubbleConfig.baseUrl).toThrowError(NotIntializedError);
  });
});
