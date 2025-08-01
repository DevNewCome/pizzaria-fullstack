const { exec } = require('child_process');
const path = require('path');

const dashboardPath = path.join(__dirname, 'test-dashboard.html');

console.log('🍕 Abrindo Dashboard de Testes...');
console.log('📊 Arquivo:', dashboardPath);

// Comando para abrir o arquivo HTML no navegador padrão
const command = process.platform === 'win32' 
  ? `start ${dashboardPath}`
  : process.platform === 'darwin'
    ? `open ${dashboardPath}`
    : `xdg-open ${dashboardPath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro ao abrir dashboard:', error.message);
    console.log('💡 Tente abrir manualmente o arquivo: test-dashboard.html');
    return;
  }
  
  console.log('✅ Dashboard aberto com sucesso!');
  console.log('🌐 Se não abriu automaticamente, abra o arquivo test-dashboard.html no seu navegador');
}); 