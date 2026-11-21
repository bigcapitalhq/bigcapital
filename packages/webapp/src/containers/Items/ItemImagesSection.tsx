import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import type { ItemFormValues } from './types';
import type { ItemImage } from '@bigcapital/sdk-ts';
import { AppToaster, Icon } from '@/components';
import { Dropzone, DropzoneProps } from '@/components/Dropzone';
import { MIME_TYPES } from '@/components/Dropzone/mine-types';

type DropzoneWithChildrenProps = React.PropsWithChildren<DropzoneProps>;
const DropzoneWithChildren =
  Dropzone as unknown as React.ComponentType<DropzoneWithChildrenProps>;

export const ITEM_IMAGES_MAX_COUNT = 15;
export const ITEM_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const ITEM_IMAGES_ACCEPT: string[] = [
  MIME_TYPES.png,
  MIME_TYPES.jpeg,
  MIME_TYPES.webp,
];

const IMAGE_TYPE_LABELS: Record<string, string> = {
  front: 'item_images_front',
  rear: 'item_images_rear',
  other: 'item_images_other',
};

/**
 * Renders a local file preview and revokes the object URL on cleanup.
 */
function FilePreview({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <PreviewImage src={url} alt="" />;
}

function ExistingImagePreview({ image }: { image: ItemImage }) {
  return (
    <PreviewImage
      src={image.thumbnailUri ?? image.imageUri ?? ''}
      alt={image.originName ?? ''}
    />
  );
}

function EmptyDropzone({
  title,
  onOpen,
}: {
  title: string;
  onOpen: () => void;
}) {
  return (
    <EmptyDropzoneContent>
      <Icon icon="image" iconSize={24} />
      <EmptyDropzoneTitle>{title}</EmptyDropzoneTitle>
      <Button minimal outlined small onClick={onOpen}>
        {intl.get('upload_image', { fallback: 'Upload image' })}
      </Button>
    </EmptyDropzoneContent>
  );
}

interface SingleImageFieldProps {
  label: string;
  file: File | null;
  existing?: ItemImage;
  onSelect: (file: File | null) => void;
  onRemoveExisting: (imageId: number) => void;
}

/**
 * Single-image dropzone used for the front and rear roles.
 */
function SingleImageField({
  label,
  file,
  existing,
  onSelect,
  onRemoveExisting,
}: SingleImageFieldProps) {
  const openRef = useRef<() => void>(null);

  const handleRemove = () => {
    if (file) {
      onSelect(null);
      return;
    }
    if (existing) {
      onRemoveExisting(existing.id);
    }
  };

  return (
    <FieldRoot>
      <FieldLabel>{label}</FieldLabel>
      <DropzoneWithChildren
        onDrop={(files) => onSelect(files[0] ?? null)}
        onReject={() => {
          AppToaster.show({
            message: intl.get('item_image_invalid_file', {
              fallback: 'The selected file is not a valid image.',
            }),
            intent: Intent.DANGER,
          });
        }}
        accept={ITEM_IMAGES_ACCEPT}
        maxSize={ITEM_IMAGE_MAX_SIZE}
        multiple={false}
        activateOnClick={false}
        openRef={openRef as React.MutableRefObject<(() => void) | null>}
      >
        {file ? (
          <ImageTile>
            <FilePreview file={file} />
            <ImageActions>
              <Button
                minimal
                small
                intent={Intent.DANGER}
                icon="trash"
                onClick={handleRemove}
              />
            </ImageActions>
          </ImageTile>
        ) : existing ? (
          <ImageTile>
            <ExistingImagePreview image={existing} />
            <ImageActions>
              <Button
                minimal
                small
                icon="exchange"
                onClick={() => openRef.current?.()}
              />
              <Button
                minimal
                small
                intent={Intent.DANGER}
                icon="trash"
                onClick={handleRemove}
              />
            </ImageActions>
          </ImageTile>
        ) : (
          <EmptyDropzone
            title={intl.get('no_image_uploaded', {
              fallback: 'No image uploaded',
            })}
            onOpen={() => openRef.current?.()}
          />
        )}
      </DropzoneWithChildren>
    </FieldRoot>
  );
}

/**
 * Item images form section.
 */
export function ItemImagesSection() {
  const { item, itemImagesEnabled } = useItemFormContext();
  const { values, setFieldValue } = useFormikContext<ItemFormValues>();
  const [isDraggingOther, setIsDraggingOther] = useState(false);

  if (!itemImagesEnabled) {
    return null;
  }

  const existingImages = item?.images ?? [];
  const removedImageIds = values.removedImageIds ?? [];
  const imageFiles = values.imageFiles;

  const activeExistingImages = existingImages.filter(
    (image) => !removedImageIds.includes(image.id),
  );
  const frontExisting = activeExistingImages.find(
    (image) => image.type === 'front',
  );
  const rearExisting = activeExistingImages.find(
    (image) => image.type === 'rear',
  );

  const replacedCount =
    (imageFiles.front && frontExisting ? 1 : 0) +
    (imageFiles.rear && rearExisting ? 1 : 0);

  const usedCount =
    activeExistingImages.length -
    replacedCount +
    (imageFiles.front ? 1 : 0) +
    (imageFiles.rear ? 1 : 0) +
    imageFiles.other.length;

  const remainingSlots = Math.max(ITEM_IMAGES_MAX_COUNT - usedCount, 0);

  const removeExistingImage = (imageId: number) => {
    if (!removedImageIds.includes(imageId)) {
      setFieldValue('removedImageIds', [...removedImageIds, imageId]);
    }
  };

  // Selecting a new front/rear clears a previous explicit removal of the same
  // role since the server replaces the role during upload.
  const handleSelectRoleImage = (role: 'front' | 'rear', file: File | null) => {
    setFieldValue(`imageFiles.${role}`, file);
    const existing = role === 'front' ? frontExisting : rearExisting;
    if (file && existing && removedImageIds.includes(existing.id)) {
      setFieldValue(
        'removedImageIds',
        removedImageIds.filter((id) => id !== existing.id),
      );
    }
  };

  const handleAddOtherImages = (files: File[]) => {
    const acceptedFiles: File[] = [];

    for (const file of files) {
      if (file.size > ITEM_IMAGE_MAX_SIZE) {
        AppToaster.show({
          message: intl.get('item_image_too_large', {
            fallback: 'Each image must not exceed 5 MB.',
          }),
          intent: Intent.DANGER,
        });
        continue;
      }
      if (!ITEM_IMAGES_ACCEPT.includes(file.type)) {
        AppToaster.show({
          message: intl.get('item_image_invalid_type', {
            fallback: 'Only PNG, JPG, and WEBP images are supported.',
          }),
          intent: Intent.DANGER,
        });
        continue;
      }
      acceptedFiles.push(file);
    }

    const slots = remainingSlots;
    const allowedFiles = acceptedFiles.slice(0, slots);

    if (acceptedFiles.length > slots) {
      AppToaster.show({
        message: intl.get('item_image_limit_reached', {
          fallback: 'An item can have up to 15 images.',
        }),
        intent: Intent.WARNING,
      });
    }
    setFieldValue('imageFiles.other', [...imageFiles.other, ...allowedFiles]);
  };

  const removeOtherImage = (index: number) => {
    setFieldValue(
      'imageFiles.other',
      imageFiles.other.filter((_file, fileIndex) => fileIndex !== index),
    );
  };

  return (
    <SectionRoot data-section-id="images">
      <ItemFormSectionTitle>
        {intl.get('item_images', { fallback: 'Images' })}
      </ItemFormSectionTitle>

      <SectionHint>
        {intl.get('item_images_upload_hint', {
          fallback:
            'Upload up to 15 images (front, rear, and other). Each image must not exceed 5 MB. Supported formats: PNG, JPG, WEBP.',
        })}
      </SectionHint>

      <RolesGrid>
        <SingleImageField
          label={intl.get('item_images_front', { fallback: 'Front image' })}
          file={imageFiles.front}
          existing={frontExisting}
          onSelect={(file) => handleSelectRoleImage('front', file)}
          onRemoveExisting={removeExistingImage}
        />
        <SingleImageField
          label={intl.get('item_images_rear', { fallback: 'Rear image' })}
          file={imageFiles.rear}
          existing={rearExisting}
          onSelect={(file) => handleSelectRoleImage('rear', file)}
          onRemoveExisting={removeExistingImage}
        />
      </RolesGrid>

      <OtherHeader>
        <strong>
          {intl.get('item_images_other', { fallback: 'Other images' })}
        </strong>
        <CountHint>
          {usedCount} / {ITEM_IMAGES_MAX_COUNT}
        </CountHint>
      </OtherHeader>

      <OtherDropzoneWrapper>
        <DropzoneWithChildren
          onDrop={(files) => handleAddOtherImages(files as File[])}
          onDragEnter={() => setIsDraggingOther(true)}
          onDragLeave={() => setIsDraggingOther(false)}
          onReject={() => {
            AppToaster.show({
              message: intl.get('item_image_invalid_file', {
                fallback: 'The selected file is not a valid image.',
              }),
              intent: Intent.DANGER,
            });
          }}
          accept={ITEM_IMAGES_ACCEPT}
          maxSize={ITEM_IMAGE_MAX_SIZE}
          multiple
          disabled={remainingSlots === 0}
        >
          <OtherDropzoneContent $isDragging={isDraggingOther}>
            <Icon icon="cloud-upload" iconSize={20} />
            <span>
              {remainingSlots === 0
                ? intl.get('item_image_limit_reached', {
                    fallback: 'An item can have up to 15 images.',
                  })
                : intl.get('drag_images_here_or_click_to_upload', {
                    fallback: 'Drag images here or click to upload',
                  })}
            </span>
          </OtherDropzoneContent>
        </DropzoneWithChildren>
      </OtherDropzoneWrapper>

      {activeExistingImages.filter((image) => image.type === 'other').length >
        0 || imageFiles.other.length > 0 ? (
        <ImagesGrid>
          {activeExistingImages
            .filter((image) => image.type === 'other')
            .map((image) => (
              <ImageTile key={image.id}>
                <ExistingImagePreview image={image} />
                <ImageActions>
                  <Button
                    minimal
                    small
                    intent={Intent.DANGER}
                    icon="trash"
                    onClick={() => removeExistingImage(image.id)}
                  />
                </ImageActions>
                <ImageTypeLabel>
                  {intl.get(IMAGE_TYPE_LABELS[image.type] ?? 'other', {
                    fallback: 'Other',
                  })}
                </ImageTypeLabel>
              </ImageTile>
            ))}
          {imageFiles.other.map((file, index) => (
            <ImageTile key={`${file.name}-${index}`}>
              <FilePreview file={file} />
              <ImageActions>
                <Button
                  minimal
                  small
                  intent={Intent.DANGER}
                  icon="trash"
                  onClick={() => removeOtherImage(index)}
                />
              </ImageActions>
            </ImageTile>
          ))}
        </ImagesGrid>
      ) : null}
    </SectionRoot>
  );
}

const SectionRoot = styled.div`
  padding-bottom: 20px;
`;

const SectionHint = styled.p`
  margin: -10px 0 16px;
  color: #8f99a8;
  font-size: 12px;
  max-width: 520px;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FieldRoot = styled.div`
  min-width: 0;
`;

const FieldLabel = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const OtherHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 0 8px;
`;

const CountHint = styled.span`
  color: #8f99a8;
  font-size: 12px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImageTile = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #d3d8de;
  aspect-ratio: 4 / 3;
  background: rgba(128, 128, 128, 0.12);
`;

const ImageActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
`;

const ImageTypeLabel = styled.span`
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
`;

const EmptyDropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 150px;
  color: #5c7080;
`;

const EmptyDropzoneTitle = styled.span`
  font-size: 12px;
  color: #8f99a8;
`;

const OtherDropzoneWrapper = styled.div`
  margin-bottom: 12px;
`;

const OtherDropzoneContent = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 74px;
  color: ${(props) => (props.$isDragging ? '#2d72d2' : '#5c7080')};
  font-size: 13px;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
`;
