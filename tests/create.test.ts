import axios from "axios";
import { ulid } from "ulid";

import BubbleDataType from "../src/BubbleDataType";
import BubbleConfig from "../src/BubbleConfig";

import { CreateResponse } from "../src/types/responses";

describe("create", () => {
  test("performs POST request to bubble and returns ID", async () => {
    class User extends BubbleDataType {
      type = "user";
      email: string;
    }

    const _id = ulid();
    const email = ulid();

    const mockCreate: CreateResponse = {
      status: "success",
      id: _id,
    };

    BubbleConfig.set({
      app: ulid(),
      apiKey: ulid(),
    });

    const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: mockCreate,
    });

    const got = await User.create({ email });
    expect(got).toBeInstanceOf(User);
    expect(got._id).toBe(_id);
    expect(got.email).toBe(email);

    const { app, apiKey } = BubbleConfig.get();
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      `https://${app}.bubbleapps.io/api/1.1/obj/user/`,
      { email },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
  });
});
