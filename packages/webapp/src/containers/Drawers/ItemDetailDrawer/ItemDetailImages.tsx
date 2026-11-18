import React from 'react';
import intl from 'react-intl-universal';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';

const IMAGE_TYPE_LABELS: Record<string, string> = {
  front: 'item_images_front',
  rear: 'item_images_rear',
  other: 'item_images_other',
};

/**
 * Read-only item images gallery shown in the item detail drawer.
 */
export function ItemDetailImages() {
  const { item, itemImagesEnabled } = useItemDetailDrawerContext();
  const images = item?.images ?? [];
  const [activeImageId, setActiveImageId] = React.useState<number | null>(null);

  const activeImage =
    images.find((image) => image.id === activeImageId) ?? images[0];

  React.useEffect(() => {
    setActiveImageId(null);
  }, [item?.id]);

  if (!itemImagesEnabled || images.length === 0 || !activeImage) {
    return null;
  }

  return (
    <div className="item-drawer__images">
      <div className="item-drawer__images-main">
        <img
          src={activeImage.imageUri ?? activeImage.thumbnailUri ?? ''}
          alt={activeImage.originName ?? ''}
        />
        <span className="item-drawer__images-role">
          {intl.get(IMAGE_TYPE_LABELS[activeImage.type] ?? 'other', {
            fallback: 'Other',
          })}
        </span>
      </div>
      {images.length > 1 ? (
        <div className="item-drawer__images-thumbs">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={
                image.id === activeImage.id
                  ? 'item-drawer__images-thumb is-active'
                  : 'item-drawer__images-thumb'
              }
              onClick={() => setActiveImageId(image.id)}
              title={intl.get(IMAGE_TYPE_LABELS[image.type] ?? 'other', {
                fallback: 'Other',
              })}
            >
              <img
                src={image.thumbnailUri ?? image.imageUri ?? ''}
                alt={image.originName ?? ''}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
