import BubbleSDK from "../src/index";

class User extends BubbleSDK.DataType {
  type = "user";

  email: string;
  first_name: string;
  last_name: string;
}

(async () => {
  BubbleSDK.init({
    app: "cultureallyapp",
    appVersion: "version-test",
    apiKey: "123",
  });

  const newUser = await User.create({
    email: "test@test.com",
    first_name: "asdf",
    last_name: "asdf",
  });

  newUser.email = "my_new@email.com";
  await newUser.save();

  const foundUser = await User.getOne({
    constraints: [
      {
        key: "first_name",
        constraint_type: "equals",
        value: ["asdfasdf"],
      },
    ],
    sort: {
      sort_field: "Created Date",
      descending: true,
    },
  });
})();
