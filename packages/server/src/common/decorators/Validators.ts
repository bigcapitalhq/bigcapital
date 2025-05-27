import { Transform } from 'class-transformer';
import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Decorator that converts the property value to a number.
 * @returns PropertyDecorator
 */
export function ToNumber() {
  return Transform(({ value, key }) => {
    const defaultValue = null;

    if (typeof value === 'number') {
      return value;
    }
    // If value is an empty string or undefined/null, return it as-is (won’t pass validation)
    if (value === '' || value === null || value === undefined) {
      return defaultValue;
    }
    const parsed = Number(value);
    return !isNaN(parsed) ? parsed : value;
  });
}

/**
 * Validates if the property is not empty.
 * @returns PropertyDecorator
 */
export function IsOptional(validationOptions?: ValidationOptions) {
  return ValidateIf((_obj, value) => {
    return value !== null && value !== undefined && value !== '';
  }, validationOptions);
}
