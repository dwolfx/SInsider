import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { resolve, join } from 'path';

const rootDir = resolve(process.cwd());
const distZipDir = join(rootDir, 'dist-zip');
const tempStaging = join(distZipDir, 'si-seo');
const targetZip = join(distZipDir, 'si-seo.zip');

console.log('Empacotando SI-SEO para envio direto no WordPress...');

// 1. Limpa diretório de distribuição anterior
if (existsSync(distZipDir)) {
  rmSync(distZipDir, { recursive: true, force: true });
}
mkdirSync(tempStaging, { recursive: true });

// 2. Copia apenas os arquivos essenciais para produção do WordPress
const filesToCopy = [
  'si-seo.php',
];

const dirsToCopy = [
  'includes',
  'build',
];

filesToCopy.forEach((file) => {
  const src = join(rootDir, file);
  const dest = join(tempStaging, file);
  if (existsSync(src)) {
    cpSync(src, dest);
    console.log(`✓ Copiado: ${file}`);
  }
});

dirsToCopy.forEach((dir) => {
  const src = join(rootDir, dir);
  const dest = join(tempStaging, dir);
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`✓ Copiado diretório: ${dir}`);
  }
});

// 3. Compacta em ZIP usando Compress-Archive do PowerShell nativo
try {
  const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${tempStaging}' -DestinationPath '${targetZip}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  console.log(`\n🎉 Pacote ZIP pronto para o WordPress: ${targetZip}`);
  
  // Remove pasta temporária mantendo apenas o .zip
  rmSync(tempStaging, { recursive: true, force: true });
} catch (err) {
  console.error('Erro ao gerar arquivo zip:', err);
  process.exit(1);
}
