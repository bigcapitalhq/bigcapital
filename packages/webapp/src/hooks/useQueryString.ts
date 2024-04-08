
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ParseOptions, ParsedQuery, StringifyOptions, parse, stringify } from 'query-string';
import { useHistory } from 'react-router';

export interface QueryStringResult {
  [0]: ParsedQuery;
  [1]: Dispatch<SetStateAction<Record<string, any>>>;
}

type NavigateCallback = (pathnameWithParams: string, pathname: string, stringifedParams: string) => void;

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
  const [state, setState] = useState(parse(location.search, parseOptions));

  useEffect((): void => {
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      const pathname = location.pathname;
      const stringifedParams = stringify(state, stringifyOptions);
      const pathnameWithParams = pathname + '?' + stringifedParams;

      navigate(pathnameWithParams, pathname, stringifedParams);
    }
  }, [state]);

  const setQuery: typeof setState = (values): void => {
    const nextState = typeof values === 'function' ? values(state) : values;
    setState(
      (state): ParsedQuery => ({
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
export const useAppQueryString = (navigate: NavigateCallback, parseOptions: ParseOptions = {}): QueryStringResult => {
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
