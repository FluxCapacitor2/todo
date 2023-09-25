import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";
import { schema } from "./src/app/api/graphql/schema";

import {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} from "@urql/introspection";
import { writeFile } from "fs/promises";

const printed = printSchema(schema);

// TODO Try using mapper types instead of manually omitting relations: https://github.com/dotansimha/graphql-code-generator/issues/3642

const config: CodegenConfig = {
  schema: printed,
  documents: ["src/**/*.ts", "src/**/*.tsx", "src/util/urql/urql.ts"],
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
    },
    "./src/gql/graphql-graphcache.ts": {
      plugins: ["typescript", "typescript-urql-graphcache"],
    },
    "schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
  config: {
    scalars: {
      DateTime: "Date",
    },
  },
};

const minified = minifyIntrospectionQuery(getIntrospectedSchema(printed), {});
writeFile("./public/schema.json", JSON.stringify(minified));

export default config;
