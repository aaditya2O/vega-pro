const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withIosModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.projectRoot, 'ios', 'Podfile');
      if (fs.existsSync(podfilePath)) {
        let content = fs.readFileSync(podfilePath, 'utf8');
        if (!content.includes('use_modular_headers!')) {
          content = "use_modular_headers!\n\n" + content;
          fs.writeFileSync(podfilePath, content);
        }
      }
      return cfg;
    },
  ]);
}

module.exports = withIosModularHeaders;
