import type { TadaDocumentNode } from "gql.tada";

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};

export default async function doQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>
) {
  const hasEnv = import.meta.env.DATOCMS_ENV || null;
  const headers: any = {
    "Content-Type": "application/json",
    "X-Exclude-Invalid": "true",
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.DATOCMS_API_KEY}`,
  };
  if (hasEnv) headers["X-Environment"] = `${import.meta.env.DATOCMS_ENV || ""}`;
  if (options?.includeDrafts) headers["X-Include-Drafts"] = "true";

  const response = await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables: options?.variables,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(errors[0].message);
  }
  return data;
}
