import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- PACKAGING VEGAPRO.IPA ---');

if (fs.existsSync('Payload')) {
  fs.rmSync('Payload', { recursive: true, force: true });
}
fs.mkdirSync('Payload', { recursive: true });

console.log('Extracting VegaPro.app from VegaPro-build.tar.gz into Payload/...');
execSync('tar -xzf VegaPro-build.tar.gz -C Payload', { stdio: 'inherit' });

console.log('Contents of Payload:');
console.log(fs.readdirSync('Payload'));

console.log('Compressing Payload into VegaPro.ipa...');
execSync('powershell -Command "Compress-Archive -Path Payload -DestinationPath VegaPro.zip -Force"', { stdio: 'inherit' });

if (fs.existsSync('VegaPro.ipa')) {
  fs.unlinkSync('VegaPro.ipa');
}
fs.renameSync('VegaPro.zip', 'VegaPro.ipa');

const stats = fs.statSync('VegaPro.ipa');
console.log(`\n🎉 Successfully created VegaPro.ipa! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)`);

// Clean up Payload directory
fs.rmSync('Payload', { recursive: true, force: true });
