import { spawn } from 'child_process';

const env = {
  ...process.env,
  EXPO_TOKEN: 'iJk2H2_tqhGau_lw8cBRHuXxwRMGmhC7TLZxPyUp',
  CI: '1',
};

const profile = process.argv[2] || 'production';
const args = ['eas-cli', 'build', '--platform', 'ios', '--profile', profile, '--non-interactive'];

console.log('Spawning EAS build:', args.join(' '));

const child = spawn('npx', args, {
  env,
  shell: true,
  stdio: 'inherit',
});

child.on('close', (code) => {
  console.log(`EAS build exited with code ${code}`);
  process.exit(code ?? 0);
});
