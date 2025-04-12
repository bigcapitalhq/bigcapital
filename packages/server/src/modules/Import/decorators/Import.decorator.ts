import { Global } from "@nestjs/common";

const importableModels = new Map<string, boolean>();
const importableService = new Map<string, any>()

/**
 * Decorator that marks a model as exportable and registers its metadata.
 * @param metadata Model metadata configuration for export
 */
export function ImportableModel() {
  return function (target: any) {
    const modelName = target.name;
    importableModels.set(modelName, true);
  };
}

export function ImportableService({ name }: { name: string }) {
  return function (target: any) {
    importableService.set(name, target);

    // Apply the @Global() decorator to make the service globally available
    Global()(target);
  };
}

/**
 * Gets the registered exportable model metadata
 * @param modelName Name of the model class
 */
export function getImportableModelMeta(modelName: string): boolean | undefined {
  return importableModels.get(modelName);
}


export function getImportableService(modelName: string) {
  return importableService.get(modelName);
}