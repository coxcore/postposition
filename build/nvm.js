/**
 * .nvmrc 로의 Node 버전 동기화 헬퍼
 *
 * nvm-windows 는 'nvm use' 가 .nvmrc 를 자동 인식하지 않으므로,
 * .nvmrc 를 읽어 버전을 추출한 뒤 nvm 명령에 전달합니다.
 *
 *  npm run nvm:install  # .nvmrc 버전 설치 후 사용
 *  npm run nvm:use      # .nvmrc 버전 사용(설치되어 있어야 함)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rcPath = path.join(__dirname, '../.nvmrc');
const version = fs.readFileSync(rcPath, 'utf8').trim();

if (!version) {
    console.error('.nvmrc 파일을 읽을 수 없습니다.');
     process.exit(1);
}

const mode = process.argv[2];
const cmd = mode === 'install' ? `nvm install ${version}` : `nvm use ${version}`;
try {
     execSync(cmd, { stdio: 'inherit' });
} catch (err) {
     console.error(cmd + ' 실행 실패: ' + err.message);
     process.exit(1);
}
