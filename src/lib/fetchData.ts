import executeQuery from "./doQuery";
import { graphql } from "./graphql";

export const pageFragment = graphql(`
  fragment pageFragment on PageRecord {
    id
    slug
    title
    content {
      __typename
      value
      blocks {
        __typename
        id
        image {
          responsiveImage(imgixParams: { fit: crop, w: 600, auto: format }) {
            # always required
            src
            srcSet
            width
            height

            # not required, but strongly suggested!
            alt
            title

            # LQIP (base64-encoded)
            base64

            # you can omit 'sizes' if you explicitly pass the 'sizes' prop to the image component
            sizes
          }
        }
      }
      links {
        ... on PageRecord {
          id
          slug
          title
        }
        ... on DocumentRecord {
          id
          slug
          title
          version
        }
      }
    }
  }
`);

// const sectionFragment = graphql(
//   `
//     fragment sectionFragment on SectionRecord {
//       id
//       page {
//         ...pageFragment
//       }
//       subsections {
//         id
//         page {
//           ...pageFragment
//         }
//         subsections {
//           id
//           page {
//             ...pageFragment
//           }
//         }
//       }
//     }
//   `,
//   [pageFragment]
// );

export async function getDocuments() {
  const query = graphql(
    `
      query AllDocs {
        allDocuments(first: 100, skip: 0) {
          id
          slug
          title
          version
          sections {
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
        }
      }
    `,
    [pageFragment]
  );
  const data = await executeQuery(query, { includeDrafts: true });
  console.log(data);
  return data.allDocuments;
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
  const data = await executeQuery(query, {
    variables: { first, skip },
    includeDrafts: true,
  });
  return data.pages || null;
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
