# bubble-sdk

A TypeScript wrapper around the [Bubble Data API](https://manual.bubble.io/core-resources/api/data-api).

## Usage

First, you will need to provide your `app` and `apiKey` from Bubble.

Make sure to follow [Bubble's documentation for "Activating the API" and "Setting up the GET/DATA API"](https://manual.bubble.io/help-guides/the-bubble-api/defining-the-api).

```ts
import BubbleSDK from "bubble-sdk";

BubbleSDK.init({
  app: "your-app-name",
  apiKey: "your-bubble-api-key",
});
```

### Define your types

Then you can create a class for each Data type in Bubble. You **must** define the `type`. This `type` is the name of the type as it appears in the URL when making requests to Bubble.

```ts
class User extends BubbleSDK.DataType {
  // The name of the type in Bubble.
  type = "user";

  // Define your custom fields with their types.
  email: string;
  first_name: string;
}
```

### Fetching data

To fetch by ID:

```ts
const user: User = await User.getByID("123");
```

To search:

```ts
const res: SearchResponse<User> = await User.search({
  constraints: [
    { key: "first_name", constraint_type: "contains", values: ["asdf"] },
  ],
  sort: {
    sort_field: "Created Date",
    descending: true,
  },
});
```

To get one item by searching:

```ts
const user: User | null = await User.getFirst(/** Accepts search options */);
```

To get all data matching search:
_Use with caution as this will make unlimited API requests to Bubble in order to page through all results_

```ts
const users: User[] = await User.getAll(/** Accepts search options */);
```

### Create and update

Creating a new object returns the ID of the created object.

```ts
const userID: string = await User.create({ email: "..." });
```

Update an object by calling `.save()`

```ts
const user: User = await User.getByID("123");
user.email = "new@email.com";
await user.save();
```
