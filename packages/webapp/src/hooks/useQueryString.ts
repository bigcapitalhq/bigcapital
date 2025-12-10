// @ts-nocheck
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as qs from 'qs';
import { useHistory } from 'react-router';

export interface QueryStringResult {
  [0]: Record<string, any>;
  [1]: Dispatch<SetStateAction<Record<string, any>>>;
}

type NavigateCallback = (
  pathnameWithParams: string,
  pathname: string,
  stringifedParams: string,
) => void;

type ParseOptions = {
  parseNumbers?: boolean;
  parseBooleans?: boolean;
  [key: string]: any;
};

type StringifyOptions = qs.IStringifyOptions;

/**
 * Checks if a string represents a number (including negatives, decimals, scientific notation)
 */
const isNumber = (val: string): boolean => {
  return !isNaN(parseFloat(val)) && isFinite(Number(val)) && val !== '';
};

/**
 * Checks if a string represents a boolean
 */
const isBoolean = (val: string): boolean => {
  return val === 'false' || val === 'true';
};

/**
 * Custom decoder for qs to parse numbers and booleans
 * Based on query-types library approach: https://github.com/xpepermint/query-types
 */
const createDecoder = (parseNumbers: boolean, parseBooleans: boolean) => {
  return (str: string, defaultDecoder?: any, charset?: string, type?: 'key' | 'value') => {
    // Only decode values, not keys
    if (type === 'key') {
      return defaultDecoder ? defaultDecoder(str, defaultDecoder, charset) : str;
    }

    // First decode using default decoder
    const decoded = defaultDecoder ? defaultDecoder(str, defaultDecoder, charset) : decodeURIComponent(str);

    // Handle empty strings and undefined
    if (typeof decoded === 'undefined' || decoded === '') {
      return null;
    }

    // Parse booleans first (before numbers, as 'true'/'false' are strings)
    if (parseBooleans && isBoolean(decoded)) {
      return decoded === 'true';
    }

    // Parse numbers if enabled (handles integers, decimals, negatives, scientific notation)
    if (parseNumbers && isNumber(decoded)) {
      return Number(decoded);
    }

    return decoded;
  };
};

/**
 * Query string.
 * @param {Location} location
 * @param {NavigateCallback} navigate
 * @param {ParseOptions} parseOptions
 * @param {StringifyOptions} stringifyOptions
 * @returns {QueryStringResult}
 */
export function useQueryString(
  location: Location,
  navigate: NavigateCallback,
  parseOptions?: ParseOptions,
  stringifyOptions?: StringifyOptions,
): QueryStringResult {
  const isFirst = useRef(true);

  // Extract parseNumbers and parseBooleans from parseOptions
  const { parseNumbers = false, parseBooleans = false, ...qsParseOptions } = parseOptions || {};

  // Create decoder if needed
  const parseConfig = {
    ...qsParseOptions,
    ...(parseNumbers || parseBooleans ? {
      decoder: createDecoder(parseNumbers, parseBooleans),
    } : {}),
  };

  const [state, setState] = useState(
    qs.parse(location.search.substring(1), parseConfig)
  );

  useEffect((): void => {
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      const pathname = location.pathname;
      const stringifedParams = qs.stringify(state, stringifyOptions);
      const pathnameWithParams = pathname + '?' + stringifedParams;

      navigate(pathnameWithParams, pathname, stringifedParams);
    }
  }, [state]);

  const setQuery: typeof setState = (values): void => {
    const nextState = typeof values === 'function' ? values(state) : values;
    setState(
      (state): Record<string, any> => ({
        ...state,
        ...nextState,
      }),
    );
  };

  return [state, setQuery];
}

/**
 * Query string hook integrate with react router of the application.
 * @param {NavigateCallback} navigate
 * @param {ParseOptions} parseOptions
 * @returns {QueryStringResult}
 */
export const useAppQueryString = (
  navigate: NavigateCallback,
  parseOptions: ParseOptions = {},
): QueryStringResult => {
  const history = useHistory();

  return useQueryString(
    window.location,
    (pathnameWithParams, pathname, stringifiedParams) => {
      history.push({ pathname, search: stringifiedParams });
      navigate && navigate(pathnameWithParams, pathname, stringifiedParams);
    },
    {
      parseNumbers: true,
      parseBooleans: true,
      ...parseOptions,
    },
  );
};
