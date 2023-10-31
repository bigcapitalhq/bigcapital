import FormData from 'form-data';
import fetch from 'node-fetch';

export class GotenbergUtils {
  public static assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new Error(message);
    }
  }

  public static async fetch(endpoint: string, data: FormData): Promise<Buffer> {
    const response = await fetch(endpoint, {
      method: 'post',
      body: data,
      headers: {
        ...data.getHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.buffer();
  }
}
