/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""
const isUserOrOrgPage = repoName.toLowerCase().endsWith(".github.io")
const basePath =
  process.env.GITHUB_ACTIONS === "true" && repoName && !isUserOrOrgPage
    ? `/${repoName}`
    : ""

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
