import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs';
import zlib from 'zlib';

const buildId = process.argv[2] || '506d9969-7207-4086-95fc-12da786b6804';
const env = {
  ...process.env,
  EXPO_TOKEN: 'iJk2H2_tqhGau_lw8cBRHuXxwRMGmhC7TLZxPyUp',
};

const raw = execSync(`npx eas-cli build:view ${buildId} --json`, { env, encoding: 'utf8' });
const jsonStart = raw.indexOf('{');
const build = JSON.parse(raw.slice(jsonStart));

console.log('Build status:', build.status);
console.log('Build profile:', build.buildProfile);
console.log('Log files count:', build.logFiles ? build.logFiles.length : 0);
if (build.artifacts && Object.keys(build.artifacts).length) {
  console.log('Artifacts:', JSON.stringify(build.artifacts, null, 2));
}

if (build.logFiles && build.logFiles.length > 0) {
  const url = build.logFiles[0];
  https.get(url, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const buf = Buffer.concat(chunks);
      let text = '';
      try {
        text = zlib.brotliDecompressSync(buf).toString('utf8');
      } catch {
        try {
          text = zlib.gunzipSync(buf).toString('utf8');
        } catch {
          text = buf.toString('utf8');
        }
      }
      fs.writeFileSync('build-log.txt', text);
      const lines = text.split('\n');
      console.log('Saved build-log.txt, total lines:', lines.length);
      console.log('--- BUILD LOG LAST 25 LINES ---');
      lines.slice(-25).forEach((line) => {
        try {
          const parsed = JSON.parse(line);
          console.log(parsed.msg || parsed.err?.message || line);
        } catch {
          console.log(line);
        }
      });
    });
  });
}
