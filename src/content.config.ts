import { getDocuments } from "@lib/fetchData";
// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
// import { glob, file } from "astro/loaders";

// 3. Define your collection(s)
const docs = defineCollection({
  loader: async () => await getDocuments(),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    version: z.string(),
    sections: z.array(
      z.object({
        id: z.string(),
        page: z.object({ id: z.string(), title: z.string(), slug: z.string() }),
        subsections: z.array(
          z.object({
            id: z.string(),
            page: z.object({
              id: z.string(),
              title: z.string(),
              slug: z.string(),
            }),
          })
        ),
      })
    ),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { docs };
