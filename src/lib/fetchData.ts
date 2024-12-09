import doQuery from "./doQuery";

export async function getDocuments() {
  const query = `
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
`;
  const data = await doQuery(query);

  return data?.allDocuments;
}

async function getPages(first: number, skip: number) {
  const query = `
allPages(first: "100", skip: "0") {
  docs:_allReferencingDocuments {
    id
  }
  ...pageFragment
}

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
`;
  const data = await doQuery(query);
  return data?.allPages;
}
export async function getAllPAges() {
  let hasElements = true;
  const first = 100;
  let skip = 0;
  let data: any = [];
  while (hasElements) {
    const results = await getPages(first, skip);
    if (results) {
      skip += first;
      data = [...data, ...results];
    } else {
      hasElements = false;
    }
  }

  return data;
}
