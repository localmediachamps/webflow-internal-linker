// ASCII-encoded verification script for build process
const fs = require('fs');
const path = require('path');

console.log('Running verification checks...');

// Counters for verification summary
let failedChecks = 0;
let passedChecks = 0;

// Helper function to log check results
function logCheck(passed, message) {
  if (passed) {
    console.log(`✅ ${message}`);
    passedChecks++;
  } else {
    console.log(`❌ ${message}`);
    failedChecks++;
  }
}

// File paths
const projectRoot = process.cwd();
const componentsDir = path.join(projectRoot, 'src', 'components');
const dashboardLayoutPath = path.join(componentsDir, 'DashboardLayout.tsx');
const postDetailDir = path.join(projectRoot, 'src', 'app', 'dashboard', 'posts', '[id]');
const postDetailPath = path.join(postDetailDir, 'page.tsx');
const typesDir = path.join(projectRoot, 'src', 'types');
const authTypesPath = path.join(typesDir, 'next-auth.d.ts');
const supabasePath = path.join(projectRoot, 'src', 'lib', 'supabase.ts');

// Check if the DashboardLayout file was deleted
logCheck(!fs.existsSync(dashboardLayoutPath), 'DashboardLayout.tsx was deleted');

// Check if the post detail page exists
if (fs.existsSync(postDetailPath)) {
  const content = fs.readFileSync(postDetailPath, 'utf8');
  logCheck(!content.includes('DashboardLayout'), 'Post detail page has no references to DashboardLayout');
} else {
  logCheck(false, 'Post detail page exists');
}

// Check if the next-auth types exist
if (fs.existsSync(authTypesPath)) {
  const content = fs.readFileSync(authTypesPath, 'utf8');
  logCheck(content.includes('id?: string'), 'Next-auth types have required id field');
} else {
  logCheck(false, 'Next-auth types file exists');
}

// Check if Supabase has getUserByEmail function
if (fs.existsSync(supabasePath)) {
  const content = fs.readFileSync(supabasePath, 'utf8');
  logCheck(content.includes('getUserByEmail'), 'getUserByEmail function exists in supabase.ts');
} else {
  logCheck(false, 'supabase.ts exists');
}

// Check the existence of all critical files
const criticalFiles = [
  { path: path.join(projectRoot, 'src', 'app', 'layout.tsx'), name: 'Root layout' },
  { path: path.join(projectRoot, 'src', 'app', 'page.tsx'), name: 'Home page' },
  { path: path.join(projectRoot, 'next.config.js'), name: 'Next.js config' },
  { path: path.join(projectRoot, 'package.json'), name: 'Package.json' },
  { path: path.join(projectRoot, 'tsconfig.json'), name: 'TypeScript config' },
  { path: path.join(projectRoot, 'tailwind.config.js'), name: 'Tailwind config' },
  { path: path.join(projectRoot, 'postcss.config.js'), name: 'PostCSS config' },
  { path: path.join(projectRoot, 'jsconfig.json'), name: 'JS config' }
];

for (const file of criticalFiles) {
  logCheck(fs.existsSync(file.path), `${file.name} exists`);
}

// Print verification summary
console.log(`\nVerification summary: ${passedChecks} checks passed, ${failedChecks} checks failed`);

if (failedChecks > 0) {
  console.log('\n⚠️ Some checks failed - you may need to run cleanup again before building');
} else {
  console.log('\n🎉 All checks passed! The project should build successfully');
}

console.log('Verification completed'); 