import axios from "axios";
import { ulid } from "ulid";

import BubbleDataType from "../src/BubbleDataType";
import BubbleConfig from "../src/BubbleConfig";

describe("search", () => {
  test("performs GET request to bubble and returns full search results", async () => {
    class User extends BubbleDataType {
      type = "user";
      email: string;
    }

    BubbleConfig.set({ app: ulid(), apiKey: ulid() });

    const _id = ulid();
    const email = ulid();

    const spy = jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        response: {
          cursor: 0,
          results: [{ _id, email }],
          remaining: 0,
          count: 1,
        },
      },
    });

    const got = await User.search({
      constraints: [
        {
          key: "email",
          constraint_type: "not empty",
        },
      ],
      sort: {
        sort_field: "Created Date",
        descending: true,
      },
    });

    expect(got.cursor).toBe(0);
    expect(got.remaining).toBe(0);
    expect(got.count).toBe(1);

    // Results is an array of the class
    expect(Array.isArray(got.results)).toBe(true);
    expect(got.results.length).toBe(1);
    expect(got.results[0]).toBeInstanceOf(User);
    expect(got.results[0]._id).toBe(_id);
    expect(got.results[0].email).toBe(email);

    const { app, apiKey } = BubbleConfig.get();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `https://${app}.bubbleapps.io/api/1.1/obj/user`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: {
          constraints: JSON.stringify([
            { key: "email", constraint_type: "not empty" },
          ]),
          sort_field: "Created Date",
          descending: "true",
          cursor: undefined,
        },
      }
    );
  });
});
