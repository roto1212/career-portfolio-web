import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  APP_URL: z.string().url().optional(),
  // Notion CMS (서버 전용 — NEXT_PUBLIC 금지)
  NOTION_TOKEN: z.string().min(1),
  NOTION_ORGS_DS_ID: z.string().uuid(),
  NOTION_PROJECTS_DS_ID: z.string().uuid(),
  NOTION_ACHIEVEMENTS_DS_ID: z.string().uuid(),
  NOTION_SKILLS_DS_ID: z.string().uuid(),
  NOTION_PROFILE_DS_ID: z.string().uuid(),
  REVALIDATE_SECRET: z.string().min(16),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  APP_URL: process.env.APP_URL,
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_ORGS_DS_ID: process.env.NOTION_ORGS_DS_ID,
  NOTION_PROJECTS_DS_ID: process.env.NOTION_PROJECTS_DS_ID,
  NOTION_ACHIEVEMENTS_DS_ID: process.env.NOTION_ACHIEVEMENTS_DS_ID,
  NOTION_SKILLS_DS_ID: process.env.NOTION_SKILLS_DS_ID,
  NOTION_PROFILE_DS_ID: process.env.NOTION_PROFILE_DS_ID,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
})

export type Env = z.infer<typeof envSchema>
