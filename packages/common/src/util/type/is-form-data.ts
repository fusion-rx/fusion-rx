/**
 * Safely assert whether the given value is a FormData instance.
 *
 * In some execution environments FormData is not defined.
 */
export function isFormData(value: any): value is FormData {
    return typeof FormData !== 'undefined' && value instanceof FormData;
}
