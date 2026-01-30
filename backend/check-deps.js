const fs = require('fs');
const path = require('path');

// Installation manuelle de stripe en copiant depuis package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('Dépendances requises:');
console.log(packageJson.dependencies);

// Vérifier les dépendances manquantes
const nodemodulesPath = path.join(__dirname, 'node_modules');
const missing = [];

for (const [pkg, version] of Object.entries(packageJson.dependencies)) {
  const pkgPath = path.join(nodemodulesPath, pkg);
  if (!fs.existsSync(pkgPath)) {
    missing.push(`${pkg}@${version}`);
  }
}

if (missing.length > 0) {
  console.log('\n⚠️ Packages manquants:');
  console.log(missing.join('\n'));
  console.log('\nVeuillez exécuter: npm install');
} else {
  console.log('\n✓ Toutes les dépendances sont installées');
}
