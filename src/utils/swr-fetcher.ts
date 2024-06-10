import axios from "axios";
import { Fetcher } from "swr";

export const fetcher: Fetcher<any, any> = async ([url, type, ...rest]: [
  string,
  "get" | "post" | "put" | "delete",
  any[]?
]) => {
  return await axios[type](url, ...rest);
};

export const genericMutationFetcher = async (
  url: string,
  {
    arg,
  }: {
    arg: {
      type: "get" | "post" | "put" | "delete";
      rest?: any[];
    };
  }
) => {
  return await axios[arg.type](url, ...(arg.rest || []));
};
