import { Injectable } from '@nestjs/common';

// Array to store attachable model names
const attachableModelsMap: Map<string, boolean> = new Map();

/**
 * Decorator that marks a class as attachable and adds its name to the attachable models array.
 * This is used to track which models can have attachments.
 */
export function InjectAttachable() {
  return function (target: any) {
    // Add the model name to the attachable models array
    attachableModelsMap.set(target.name, true);
  };
}

/**
 * Get all attachable model names
 */
export function getAttachableModelsMap() {
  return attachableModelsMap;
}

