/**
 * This function converting Enum to an array of enum.
 * In typescript Enums are real objects that exist at runtime.
 * @param param is an Enum
 * @returns Array of enum
 */
const convertEnumToArray = <T>(param: object): T[] => {
  return Object.values(param) as T[];
};

export { convertEnumToArray };
