import type { TadaDocumentNode } from "gql.tada";
import { print } from "@0no-co/graphql.web";

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
export default async function doQuery<Result, Variables>(
  query: string | TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>
): Promise<Result> {
  if (!query) {
    throw new Error("Query is not valid");
  }

  const serializedQuery = typeof query === "string" ? query : print(query);
  console.log(serializedQuery);
  const headers: any = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.DATOCMS_API_KEY}`,
    "X-Exclude-Invalid": "true",
  };
  const hasEnv = import.meta.env.DATOCMS_ENV || null;
  if (hasEnv) headers["X-Environment"] = `${import.meta.env.DATOCMS_ENV || ""}`;
  if (options?.includeDrafts) headers["X-Include-Drafts"] = "true";

  const body = JSON.stringify({
    query: serializedQuery,
    variables: options?.variables || null,
  });

  const response = await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers,
    body,
  });
  console.log("RESPONSE STATUS", response.status);
  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(errors[0].message);
  }
  return data as Result;
}
