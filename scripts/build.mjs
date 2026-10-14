import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/app.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  outfile: "app.js",
  legalComments: "none",
  define: { "process.env.NODE_ENV": '"production"' },
});
