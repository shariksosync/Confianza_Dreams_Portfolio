import fs from "fs";
import path from "path";

const map = JSON.parse(fs.readFileSync("scripts/cloudinary_migration_map.json", "utf8"));

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.name.endsWith(".js") || file.name.endsWith(".jsx") || file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
      callback(fullPath);
    }
  }
}

let totalReplacements = 0;
const modifiedFiles = [];

walkDir(path.join(process.cwd(), "src"), (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("tridevsosync")) return;

  let fileChanged = false;
  // 1. Replace exact URLs from map
  for (const [oldUrl, newUrl] of Object.entries(map)) {
    if (content.includes(oldUrl)) {
      content = content.replaceAll(oldUrl, newUrl);
      fileChanged = true;
      totalReplacements++;
    }
  }

  // 2. Generic fallback replace for any remaining tridevsosync domain references
  if (content.includes("tridevsosync")) {
    const before = content;
    content = content.replaceAll("tridevsosync", "kipl0jjw");
    if (content !== before) {
      fileChanged = true;
      totalReplacements++;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, content, "utf8");
    modifiedFiles.push(path.relative(process.cwd(), filePath));
  }
});

console.log(`Updated ${modifiedFiles.length} files with ${totalReplacements} Cloudinary URL replacements:`);
modifiedFiles.forEach((f) => console.log(" - " + f));
