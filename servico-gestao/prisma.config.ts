// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/infrastructure/database/seed.ts",
  },
  datasource: {
    url: "file:./prisma/dev.db",
  },
});