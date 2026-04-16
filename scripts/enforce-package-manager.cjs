const userAgent = process.env.npm_config_user_agent || "";
const execPath = process.env.npm_execpath || "";

const isPnpm =
  userAgent.startsWith("pnpm/") ||
  execPath.includes("pnpm") ||
  execPath.includes("corepack");

if (isPnpm) {
  process.exit(0);
}

console.error("");
console.error("This workspace must be installed with pnpm.");
console.error("Run `corepack pnpm install` from the repository root.");
console.error("Using `npm install` can create a broken mixed node_modules tree.");
console.error("");
process.exit(1);
