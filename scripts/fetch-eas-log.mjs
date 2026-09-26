import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs';
import zlib from 'zlib';

const buildId = process.argv[2] || '29d5d5ab-f443-4e42-a483-cba0f19f027f';
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

if (build.logFiles && build.logFiles.length > 0) {
  const url = build.logFiles[0];
  https.get(url, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const buf = Buffer.concat(chunks);
      let text = '';
      try {
        text = zlib.gunzipSync(buf).toString('utf8');
      } catch (err) {
        text = buf.toString('utf8');
      }
      fs.writeFileSync('build-log.txt', text);
      console.log('Saved build-log.txt, total length:', text.length);
      console.log('--- BUILD LOG TAIL ---');
      console.log(text.slice(-3000));
    });
  });
}
