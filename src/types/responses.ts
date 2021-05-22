export interface GetByIDResponse<T = {}> {
  response: T;
}

export interface CreateResponse {
  status: "success" | unknown;
  id: string;
}

export interface SearchResponse<T = {}> {
  response: {
    cursor: number;
    results: T[];
    remaining: number;
    count: number;
  };
}
