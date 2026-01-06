
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Erro Crítico: Elemento root não encontrado no DOM.";
  console.error(errorMsg);
  document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;"><h1>${errorMsg}</h1></div>`;
  throw new Error(errorMsg);
}

try {
  console.log("Iniciando aplicação React...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro fatal na renderização do React:", error);
  document.body.innerHTML = `
    <div style="padding: 40px; color: #b11818; font-family: sans-serif; background: #fff5f5; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="background: white; padding: 30px; border-radius: 12px; shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; width: 100%;">
        <h1 style="font-size: 24px; margin-bottom: 16px; font-weight: 800; italic;">⚠️ ERRO DE ENGENHARIA SK-G</h1>
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">O sistema não pôde ser iniciado. Detalhes para o suporte:</p>
        <pre style="background: #1a202c; color: #a0aec0; padding: 15px; border-radius: 8px; overflow: auto; font-size: 12px; line-height: 1.5;">${error instanceof Error ? error.stack : String(error)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 25px; width: 100%; padding: 12px; background: #b11818; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
          Reiniciar Aplicação
        </button>
      </div>
    </div>
  `;
}
