const fs = require('fs');
const path = require('path');

const fixPropMismatch = () => {
  // src/app/campaigns/[id]/page.tsx
  let file = path.join(__dirname, 'src', 'app', 'campaigns', '[id]', 'page.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/isDestructive={.*}/, '');
  fs.writeFileSync(file, content);

  // src/app/campaigns/new/page.tsx
  file = path.join(__dirname, 'src', 'app', 'campaigns', 'new', 'page.tsx');
  content = fs.readFileSync(file, 'utf8');
  content = content.replace(/hideActions=\{true\}/, '');
  content = content.replace(/<RecipientSelector\s*selected=\{data\.recipients\}\s*onChange=\{handleChange\('recipients'\)\}\s*\/>/, '<RecipientSelector campaignId="new" onRecipientsChange={handleChange(\'recipients\')} />');
  content = content.replace(/<TemplatePreview\s*templateId=\{data\.templateId\}\s*data=\{data\}\s*\/>/, '<TemplatePreview html={data.description || ""} />');
  fs.writeFileSync(file, content);

  // src/app/campaigns/page.tsx
  file = path.join(__dirname, 'src', 'app', 'campaigns', 'page.tsx');
  content = fs.readFileSync(file, 'utf8');
  content = content.replace(/campaigns=\{campaigns\}/, 'campaigns={campaigns as any}');
  fs.writeFileSync(file, content);

  // src/app/campaigns/templates/[id]/page.tsx
  file = path.join(__dirname, 'src', 'app', 'campaigns', 'templates', '[id]', 'page.tsx');
  content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<TemplateEditor\s*content=\{data\.htmlContent\}\s*onChange=\{handleChange\('htmlContent'\)\}\s*\/>/, '<TemplateEditor initialContent={data.htmlContent} onChange={(html, json) => { handleChange(\'htmlContent\')(html); handleChange(\'jsonContent\')(json); }} />');
  content = content.replace(/<TemplatePreview\s*rawHtml=\{data\.htmlContent\}\s*data=\{data\}\s*\/>/, '<TemplatePreview html={data.htmlContent} />');
  fs.writeFileSync(file, content);

  // src/app/campaigns/templates/new/page.tsx
  file = path.join(__dirname, 'src', 'app', 'campaigns', 'templates', 'new', 'page.tsx');
  content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<TemplateEditor\s*content=\{data\.htmlContent\}\s*onChange=\{handleChange\('htmlContent'\)\}\s*\/>/, '<TemplateEditor initialContent={data.htmlContent} onChange={(html, json) => { handleChange(\'htmlContent\')(html); handleChange(\'jsonContent\')(json); }} />');
  content = content.replace(/<TemplatePreview\s*rawHtml=\{data\.htmlContent\}\s*data=\{data\}\s*\/>/, '<TemplatePreview html={data.htmlContent} />');
  fs.writeFileSync(file, content);

  console.log("Fixed prop mismatches");
};

fixPropMismatch();
