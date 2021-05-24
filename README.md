# bubble-sdk

This package provides a type-safe wrapper around the Bubble Data API.

## Usage

### Configure

First, you will need to provide your `app` and `apiKey` from Bubble.

```ts
BubbleConfig.set({
  app: "your-app-name",
  apiKey: "your-bubble-api-key",
});
```

### Define your types

Then you can create a class for each Data type in Bubble. You **must** define the `type`. This `type` is the name of the type as it appears in the URL when making requests to Bubble.

```ts
class User extends BubbleDataType {
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

Create a new object:

```ts
const userID: string = await User.create({ email: "..." });
```

Update an object by calling .save()

```ts
const user: User = await User.getByID("123");
user.email = "new@email.com";
await user.save();
```
