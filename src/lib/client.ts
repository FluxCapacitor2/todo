"use client";

import { useEffect } from "react";
import { AnyVariables, UseQueryArgs, UseQueryResponse, useQuery } from "urql";

export function useRefreshingQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  args: UseQueryArgs<Variables, Data> & {
    /** The time in seconds between refresh attempts */
    refreshInterval: number;
  }
): UseQueryResponse<Data, Variables> {
  const [result, reexecuteQuery] = useQuery(args);

  useEffect(() => {
    if (result.fetching || args.pause) {
      return;
    }
    const id = setTimeout(
      () => reexecuteQuery({ requestPolicy: "network-only" }),
      args.refreshInterval * 1000
    );
    return () => clearTimeout(id);
  }, [result.fetching, reexecuteQuery]);

  return [result, reexecuteQuery];
}
