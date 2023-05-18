import { ErrorResponse } from "./types";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export default class Client {
  public token: string;
  private setToken?: React.Dispatch<React.SetStateAction<string | null | undefined>>;

  static Default = new Client("", undefined);

  constructor(token: string, setToken?: React.Dispatch<React.SetStateAction<string | null | undefined>>) {
    this.token = token;
    this.setToken = setToken;
  }

  public async get(path: string) {
    return await this.performRequest("GET", path);
  }

  public async post<T>(path: string, body?: T) {
    return await this.performRequest<T>("POST", path, body);
  }

  public async put<T>(path: string, body?: T) {
    return await this.performRequest<T>("PUT", path, body);
  }

  public async delete<T>(path: string, body?: T) {
    return await this.performRequest<T>("DELETE", path, body);
  }

  private async performRequest<T>(method: HttpMethod, path: string, body?: T) {
    const response = await fetch(path, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    let res;
    try {
      res = await response.json();
    } catch (e) {
      // void response
    }
    if (!response.ok) {
      if (response.status === 401) {
        this.setToken?.(null);
        throw new Error(JSON.stringify((res ? res : { status: 401, error: "Unauthorized" }) as ErrorResponse));
      }

      throw new Error(JSON.stringify(res as ErrorResponse));
    }

    return res;
  }
}
