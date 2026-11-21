import * as sharp from 'sharp';
import { ItemImageProcessor } from './ItemImageProcessor';
import { ServiceError } from './ServiceError';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

describe('ItemImageProcessor', () => {
  const processor = new ItemImageProcessor();

  it('detects the image type and generates a JPEG thumbnail', async () => {
    const result = await processor.process(ONE_PIXEL_PNG);

    expect(result.mimeType).toEqual('image/png');
    expect(result.extension).toEqual('png');

    const metadata = await sharp(result.thumbnail).metadata();
    expect(metadata.format).toEqual('jpeg');
    expect(metadata.width).toBeLessThanOrEqual(512);
    expect(metadata.height).toBeLessThanOrEqual(512);
  });

  it('rejects files that are not supported images', async () => {
    await expect(
      processor.process(Buffer.from('not an image')),
    ).rejects.toBeInstanceOf(ServiceError);
  });
});
