import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootDivId = 'pishiavoid-root';

// Evita múltiplas inserções caso o script seja injetado mais de uma vez
if (!document.getElementById(rootDivId)) {
  const rootDiv = document.createElement('div');
  rootDiv.id = rootDivId;

  // Estilos para o container da extensão — ajuste conforme necessário
  Object.assign(rootDiv.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '9999',
    backgroundColor: 'green',
    width: '200px',
    height: '200px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
  });

  document.body.appendChild(rootDiv);

  const root = ReactDOM.createRoot(rootDiv);
  root.render(
        <App
            remetente={"teste 2"}
        />
    );
}

function getSenderEmail(): string | null {
  const senderSpan = document.querySelector('span.gD') as HTMLSpanElement;
  return senderSpan?.getAttribute('email') || null;
}
