import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootDivId = 'pishiavoid-root';

function getSenderEmail(): string | null {
  // Seleciona a div que contém as classes 'adn ads'
  const emailContainer = document.querySelector('div.adn.ads');
  if (!emailContainer) return null;

  // A partir do container, procura o span com classe 'gD' que geralmente tem o atributo email
  const senderSpan = emailContainer.querySelector('span.go') as HTMLSpanElement | null;
  return senderSpan?.getAttribute('email') || null;
}

// Função para iniciar o MutationObserver e atualizar o React
function observeEmailOpening(rootDiv: HTMLDivElement) {

    console.log("iniciada função observeEmailOpening 14")

    const container = document.querySelector('div.adn.ads');
    if (!container) {
        // console.log("Container principal não encontrado");
        return;
    }

    const renderStatusLabel = "renderStatus"
    
    let renderStatus = sessionStorage.getItem(renderStatusLabel)
    if(!renderStatus){
        console.log("Run!")
        run(rootDiv)
        renderStatus = "true"
        sessionStorage.setItem(renderStatusLabel, renderStatus)
    }


}

function run(rootDiv: HTMLDivElement){
    document.body.appendChild(rootDiv);
    const root = ReactDOM.createRoot(rootDiv);
    root.render(<App remetente={getSenderEmail() || "Remetente não encontrado"} />);
}


// Evita múltiplas inserções caso o script seja injetado mais de uma vez
if (!document.getElementById(rootDivId)) {
    const rootDiv = document.createElement('div');
    rootDiv.id = rootDivId;

    // Estilos para o container da extensão — ajuste conforme necessário
    Object.assign(rootDiv.style, {
    position: 'fixed',
    top: '50px',
    right: '20px',
    zIndex: '9999',
    backgroundColor: 'green',
    width: '200px',
    height: '200px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    });

    // const remetente = getSenderEmail();

    // console.log("remetente: ", remetente)

    setInterval(() => {
        observeEmailOpening(rootDiv),
        10000
    })

    // const root = ReactDOM.createRoot(rootDiv);
    // root.render(
    //     <App
    //         remetente={"teste 2"}
    //     />
    // );
}

