import FormData from 'form-data';
import Axios from 'axios';

export class GotenbergUtils {
  public static assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new Error(message);
    }
  }

  public static async fetch(endpoint: string, data: FormData): Promise<Buffer> {
    try {
      const response = await Axios.post(endpoint, data, {
        headers: {
          ...data.getHeaders(),
        },
        responseType: 'arraybuffer', // This ensures you get a Buffer bac
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
