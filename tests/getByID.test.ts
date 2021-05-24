import axios from "axios";
import { ulid } from "ulid";

import BubbleDataType from "../src/BubbleDataType";
import BubbleConfig from "../src/BubbleConfig";

import { GetByIDResponse } from "../src/types/responses";

describe("getByID", () => {
  test("performs GET request to bubble and resolves instance", async () => {
    class User extends BubbleDataType {
      type = "user";

      email: string;
      first_name: string;
      last_name: string;
    }

    const mockResponse: GetByIDResponse<Partial<User>> = {
      response: {
        _id: ulid(),
        email: ulid(),
        first_name: ulid(),
        last_name: ulid(),
      },
    };

    BubbleConfig.set({
      app: ulid(),
      apiKey: ulid(),
    });

    const spy = jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockResponse });

    const getID = ulid();
    const got = await User.getByID(getID);

    expect(got).toBeInstanceOf(User);
    expect(got._id).toEqual(mockResponse.response._id);
    expect(got.email).toEqual(mockResponse.response.email);
    expect(got.first_name).toEqual(mockResponse.response.first_name);
    expect(got.last_name).toEqual(mockResponse.response.last_name);

    const { app, apiKey } = BubbleConfig.get();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      `https://${app}.bubbleapps.io/api/1.1/obj/user/${getID}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );
  });
});
