import axios, { AxiosError, AxiosResponse } from "axios";
import BubbleConfig from "./BubbleConfig";
import { BaseDataType, SearchConfig } from "./types/search";
import {
  CreateResponse,
  GetByIDResponse,
  SearchResponse,
} from "./types/responses";

export default abstract class BubbleDataType implements BaseDataType {
  // Default fields provided by Bubble
  "Created Date": string;
  "Created By": string;
  "Modified Date": string;
  _id: string;

  /** The name of the type as it appears in the URL path for requests */
  abstract type: string;

  constructor(args: Record<string, unknown>) {
    Object.assign(this, args);
  }

  /** Get an object by ID. */
  static async getByID<T extends BubbleDataType>(
    this: CustomDataClass<T>,
    id: string
  ): Promise<T> {
    const { objectUrl } = new this({});
    const { headers } = BubbleConfig;
    const res: AxiosResponse<GetByIDResponse> = await axios
      .get(`${objectUrl}/${id}`, { headers })
      .catch((err) => {
        throw new BubbleError(err);
      });
    if (!res.data) throw new Error(`Unexpected response from bubble: no body`);
    return new this(res.data.response);
  }

  /** Create a new object in Bubble, returning the ID */
  static async create<T extends BubbleDataType>(
    this: CustomDataClass<T>,
    data: CustomFields<T>
  ): Promise<T> {
    const { objectUrl } = new this({});
    const { headers } = BubbleConfig;

    const res: AxiosResponse<CreateResponse> = await axios
      .post(`${objectUrl}/`, data, { headers })
      .catch((err) => {
        throw new BubbleError(err);
      });
    if (!res.data) throw new Error(`Unexpected response from bubble: no body`);
    if (res.data.status !== "success" || !res.data.id) {
      throw new Error(`create request failed with status: ${res.data.status}`);
    }
    return new this({
      _id: res.data.id,
      ...data,
    });
  }

  /** Search all objects of the type */
  static async search<T extends BubbleDataType>(
    this: CustomDataClass<T>,
    config: SearchConfig<T> = { constraints: [] }
  ): Promise<SearchResponse<T>["response"]> {
    const { objectUrl } = new this({});
    const { headers } = BubbleConfig;

    const res: AxiosResponse<SearchResponse<T>> = await axios
      .get(objectUrl, {
        headers,
        params: {
          constraints: JSON.stringify(config.constraints || []),
          sort_field: config.sort?.sort_field,
          descending: config.sort?.descending ? "true" : false,
          cursor: config.cursor,
        },
      })
      .catch((err) => {
        throw new BubbleError(err);
      });
    if (!res.data?.response) {
      throw new Error("search request failed");
    }
    return {
      ...res.data.response,
      results: res.data.response.results.map(
        (r) => new this(r as Record<string, unknown>)
      ),
    };
  }

  /** Page through all bubble API results to get all objects matching constraints */
  static async getAll<T extends BubbleDataType>(
    this: CustomDataClass<T>,
    config: Omit<SearchConfig<T>, "cursor"> = { constraints: [] },
    callback?: (result: SearchResponse<T>["response"]) => Promise<void>
  ): Promise<T[]> {
    let cursor = 0;
    let results: T[] = [];
    let callbackPromises: Promise<void>[] = [];
    while (true) {
      // @ts-expect-error
      const res: SearchResponse<T>["response"] = await this.search({
        ...config,
        cursor,
      });
      // providing callback allows you to execute on results as they come in
      if (callback) {
        callbackPromises.push(callback(res));
      } else {
        results = results.concat(res.results);
      }
      if (res.remaining <= 0) break;
      cursor += res.count;
    }
    await Promise.all(callbackPromises);
    return results;
  }

  /** Get the first instance matching the search query. */
  static async getOne<T extends BubbleDataType>(
    this: CustomDataClass<T>,
    config: Omit<SearchConfig<T>, "cursor">
  ): Promise<T | null> {
    // @ts-expect-error
    const searchResults: SearchResponse<T>["response"] = await this.search<T>(
      config
    );
    return searchResults.results[0] || null;
  }

  async save(): Promise<void> {
    const { objectUrl } = this;
    const { headers } = BubbleConfig;
    if (!this._id) {
      throw new Error(
        "Cannot call save on a BubbleDataType without an _id value."
      );
    }
    await axios
      .patch(`${objectUrl}/${this._id}`, Object.assign({}, this), {
        headers,
      })
      .catch((err) => {
        throw new BubbleError(err);
      });
  }

  private get objectUrl(): string {
    return `${BubbleConfig.baseUrl}/obj/${this.type}`;
  }
}

export class BubbleError extends Error {
  constructor(err: AxiosError) {
    super(`Bubble request failed: ${JSON.stringify(err.response?.data)}`);
    this.name = "BubbleError";
  }
}

export type CustomDataClass<T extends BubbleDataType> = new (
  args: Record<string, unknown>
) => T;

export type CustomFields<T extends BubbleDataType> = Omit<
  T,
  keyof BubbleDataType
>;
