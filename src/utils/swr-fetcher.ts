export const fetcher = (url: any) => fetch(url).then((res) => res.json());

export const genericMutationFetcher = async (
  url: string,
  {
    arg,
  }: {
    arg: {
      type: "get" | "post" | "put" | "delete";
      rest?: any;
    };
  }
) => {
  return await fetch(url, { method: arg.type, ...(arg.rest || {}) }).then(
    (res) => res.json()
  );
};
