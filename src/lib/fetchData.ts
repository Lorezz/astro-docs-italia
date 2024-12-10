import doQuery from "./doQuery";
import { graphql } from "./graphql";

const pageFragment = graphql(`
  fragment pageFragment on PageRecord {
    id
    slug
    title
    content {
      __typename
      blocks {
        __typename
        id
      }
    }
  }
`);

const sectionFragment = graphql(
  `
    fragment sectionFragment on SectionRecord {
      id
      page {
        ...pageFragment
      }
      subsections {
        id
        page {
          ...pageFragment
        }
        subsections {
          id
          page {
            ...pageFragment
          }
        }
      }
    }
  `,
  [pageFragment]
);

export async function getDocuments() {
  const query = graphql(
    `
      query AllDocs {
        allDocuments {
          id
          slug
          title
          version
          sections {
            ...sectionFragment
          }
        }
      }
    `,
    [sectionFragment]
  );
  const data = await doQuery(query);

  return data?.allDocuments;
}

async function getPages(first: number, skip: number) {
  const query = graphql(
    `
      query getPages($first: IntType, $skip: IntType) {
        pages: allPages(first: $first, skip: $skip) {
          docs: _allReferencingDocuments {
            id
          }
          ...pageFragment
        }
      }
    `,
    [pageFragment]
  );
  const data = await doQuery(query, {
    variables: { first, skip },
    includeDrafts: true,
  });
  // console.log({ first, skip }, data?.pages?.length);
  return data?.pages || null;
}
export async function getAllPAges() {
  let hasElements = true;
  const first = 100;
  let skip = 0;
  let data: any = [];
  while (hasElements) {
    const results = await getPages(first, skip);
    if (results && results.length > 0) {
      skip += first;
      data = [...data, ...results];
    } else {
      hasElements = false;
    }
  }
  const formattedData = data
    .filter((i: any) => i.docs?.[0]?.id)
    .map((i: any) => {
      let mod = { ...i, doc: i.docs?.[0]?.id || null };
      delete mod.docs;
      return mod;
    });
  // console.log(formattedData);
  return formattedData;
}
