import { Global } from "@nestjs/common";

const exportableModels = new Map<string, boolean>();
const exportableService = new Map<string, any>()

/**
 * Decorator that marks a model as exportable and registers its metadata.
 * @param metadata Model metadata configuration for export
 */
export function ExportableModel() {
  return function (target: any) {
    const modelName = target.name;
    exportableModels.set(modelName, true);
  };
}

export function ExportableService({ name }: { name: string }) {
  return function (target: any) {
    exportableService.set(name, target);

    // Apply the @Global() decorator to make the service globally available
    Global()(target);
  };
}

/**
 * Gets the registered exportable model metadata
 * @param modelName Name of the model class
 */
export function getExportableModelMeta(modelName: string): boolean | undefined {
  return exportableModels.get(modelName);
}


export function getExportableService(modelName: string) {
  return exportableService.get(modelName);
}