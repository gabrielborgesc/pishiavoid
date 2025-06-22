import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const sessionStorageClickMostrarMaisLabel = 'clickToCaptureSender'


const rootDivId = 'pishiavoid-root';

// function getSenderEmail(): string | null {
// //   const emailContainer = document.querySelector('div.adn.ads');
// //   if (!emailContainer) return null;

//   const senderSpan = document.querySelector('span.go') as HTMLSpanElement | null;
//   console.log("senderSpan: ", senderSpan)
//   return senderSpan?.getAttribute('email') || null;
// }
function getSenderEmail(): string | null {
  const senderSpan = document.querySelector('span.go') as HTMLSpanElement | null;

  if (senderSpan) {
    // Tenta extrair o e-mail do texto interno (ignorando os <span aria-hidden>)
    const text = senderSpan.textContent || "";
    
    // Regex para identificar e-mail no texto
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    // console.log("caputrando email!")
  
    return match ? match[0] : null;

  }
  else{

    // Caso contrário, tenta clicar na seta para expandir os detalhes
    const expandButton = document.querySelector('div[aria-label="Mostrar detalhes"]') as HTMLDivElement | null;

    let jaClicou = sessionStorage.getItem(sessionStorageClickMostrarMaisLabel) === 'true'

    if (expandButton && !jaClicou) {
      // console.log("Clicando para expandir detalhes do remetente...");
      expandButton.click();
      sessionStorage.setItem(sessionStorageClickMostrarMaisLabel, 'true')
      setTimeout(() => {
        expandButton.click();
      }, 100)
    }    

    // console.log("email não explícito")
    return null
  }

}

function observeEmailOpening(rootDiv: HTMLDivElement) {
    // console.log("iniciada função observeEmailOpening 26");
    
    run(rootDiv);
    
    const container = document.querySelector('div.adn.ads');
    if (!container){
        sessionStorage.removeItem(sessionStorageClickMostrarMaisLabel)
        rootDiv.style.display = 'none';   
        return;
    } 

    rootDiv.style.display = 'block';


}

function run(rootDiv: HTMLDivElement) {
  document.body.appendChild(rootDiv);
  const root = ReactDOM.createRoot(rootDiv);
  let remetente = getSenderEmail()
  // console.log("remetente encontrado: ", remetente)
  root.render(<App remetente={remetente || "Remetente não encontrado"} />);
}

if (!document.getElementById(rootDivId)) {
  const rootDiv = document.createElement('div');
  rootDiv.id = rootDivId;

  Object.assign(rootDiv.style, {
    position: 'fixed',
    top: '50px',
    right: '20px',
    zIndex: '9999',
    backgroundColor: 'green',
    width: '20rem',
    height: '20rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    cursor: 'move', // permite arrastar
  });

  // Lógica de arrastar
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let divStartX = 0;
  let divStartY = 0;

  rootDiv.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    divStartX = rootDiv.offsetLeft;
    divStartY = rootDiv.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    rootDiv.style.left = divStartX + dx + 'px';
    rootDiv.style.top = divStartY + dy + 'px';

    // Garante que o right não interfira
    rootDiv.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
  });

  rootDiv.style.display = 'none';

  // Observa mudanças a cada 100ms
  setInterval(() => {
    observeEmailOpening(rootDiv);
  }, 100);
}
