const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const fixFiles = () => {
  const srcDir = path.join(__dirname, 'src');
  walk(srcDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
      
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      // Fix ZodError errors
      if (content.includes('error.errors') && content.includes('z.ZodError')) {
        content = content.replace(/error\.errors/g, '(error as any).errors');
        changed = true;
      }

      // Fix Next.js default imports
      const defaultImportRegex = /import\s+([A-Z]\w+)\s+from\s+['"]@\/components\/campaigns\/\1['"]/g;
      if (defaultImportRegex.test(content)) {
        content = content.replace(defaultImportRegex, 'import { $1 } from "@/components/campaigns/$1"');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
      }
    });
  });
};

fixFiles();
