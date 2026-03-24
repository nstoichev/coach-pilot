import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const isUserOrOrgSite = repositoryName?.endsWith('.github.io')
  const base =
    process.env.GITHUB_ACTIONS === 'true' && repositoryName
      ? isUserOrOrgSite
        ? '/'
        : `/${repositoryName}/`
      : '/'

  return {
    base,
    plugins: [react()],
  }
})
