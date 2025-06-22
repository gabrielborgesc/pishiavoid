import ReactDOM from 'react-dom/client';
import App from './App';

const sessionStorageClickMostrarMaisLabel = 'clickToCaptureSender'
const sessionStorageBackgroundColorLabel = 'backgroundColor'
const sessionStorageShouldRenderUILabel = 'shouldRender'
const sessionStorageIsRenderingUILabel = 'isRendering'

const rootDivId = 'pishiavoid-root';

function getEmailFromHeader(): string | null {

  const senderSpan = document.querySelector('span.go') as HTMLSpanElement | null;

  if (senderSpan) {
    // Tenta extrair o e-mail do texto interno (ignorando os <span aria-hidden>)
    const text = senderSpan.textContent || "";
    
    // Regex para identificar e-mail no texto
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    if (match) {
      // console.log("deu match!")
      let retorno = match[0]
      return retorno; // retorna o e-mail encontrado no texto
    }
  
  }
  
  return null

}

function getEmailFromDetails(): string | null {

  // Procura a linha que começa com "de:"
  const deRow = Array.from(document.querySelectorAll('tr.ajv')).find(row => {
    const label = row.querySelector('td.gG span.gI')?.textContent?.trim().toLowerCase();
    return label === "de:";
  });

  if (deRow){
    // Dentro da linha, procura o span com atributo `email`
    const senderSpan = deRow.querySelector('span[email]') as HTMLSpanElement | null;
    if (senderSpan){
      let attr = senderSpan.getAttribute('email')
      return attr;
    }

  }

  return null

}

function abreDialogMostrarMais(): void {
  // Caso contrário, tenta clicar na seta para expandir os detalhes
  const expandButton = document.querySelector('div[aria-label="Mostrar detalhes"]') as HTMLDivElement | null;

  let jaClicou = sessionStorage.getItem(sessionStorageClickMostrarMaisLabel) === 'true'

  if (expandButton && !jaClicou) {
    expandButton.click();
    sessionStorage.setItem(sessionStorageClickMostrarMaisLabel, 'true')
    setTimeout(() => {
      expandButton.click();
    }, 100)
  }
}

function getSenderEmail(): string | null {

  let emailFromHeader = getEmailFromHeader()

  if(emailFromHeader){
    return emailFromHeader
  }

  let emailFromDetails = getEmailFromDetails()
  if(emailFromDetails){
    return emailFromDetails
  }
  
  abreDialogMostrarMais()

  return null
  
}

function observeEmailOpening(rootDiv: HTMLDivElement) {
  
    rootDiv.style.backgroundColor = getBackgroundColor()

    run(rootDiv);
    
    const container = document.querySelector('div.adn.ads');
    if (!container){
        sessionStorage.removeItem(sessionStorageClickMostrarMaisLabel)
        sessionStorage.removeItem(sessionStorageShouldRenderUILabel)
        sessionStorage.removeItem(sessionStorageIsRenderingUILabel)
        rootDiv.style.display = 'none';   
        return;
    } 

    sessionStorage.setItem(sessionStorageShouldRenderUILabel, 'true')
    rootDiv.style.display = 'block';


}

function getEmailBodyContainer(): HTMLElement | null {
  return document.querySelector('div.a3s.aiL') as HTMLElement | null;
}

function extractLinksFromEmailBody(): string[] {
  const bodyContainer = getEmailBodyContainer();
  if (!bodyContainer) return [];

  const links: string[] = [];

  // Captura links explícitos
  const anchorTags = bodyContainer.querySelectorAll('a[href]');
  anchorTags.forEach((a) => {
    const href = a.getAttribute('href');
    if (href) links.push(href);
  });

  // Captura botões com onclick que redireciona
  const clickableElements = bodyContainer.querySelectorAll('[onclick]');
  clickableElements.forEach((el) => {
    const onclick = el.getAttribute('onclick');
    if (onclick && /location\.href\s*=\s*['"]([^'"]+)['"]/.test(onclick)) {
      const match = onclick.match(/['"]([^'"]+)['"]/);
      if (match && match[1]) links.push(match[1]);
    }
  });

  // Possível melhoria futura: elementos com `data-href`, etc.

  // console.log("links encontrados: ", links)
  return links;
}

function getBackgroundColor(): string {

  let backgroundColor = sessionStorage.getItem(sessionStorageBackgroundColorLabel)
  if(backgroundColor){
    return backgroundColor;
  }
  let defaultColor = 'green'
  sessionStorage.setItem(sessionStorageBackgroundColorLabel, defaultColor)
  
  return defaultColor

}

function run(rootDiv: HTMLDivElement) {
  document.body.appendChild(rootDiv);
  const root = ReactDOM.createRoot(rootDiv);
  let remetente = getSenderEmail()
  let linksList = extractLinksFromEmailBody()

  let shouldRender = sessionStorage.getItem(sessionStorageShouldRenderUILabel)
  let isRendering = sessionStorage.getItem(sessionStorageIsRenderingUILabel)


  if(shouldRender === 'true' && !isRendering){
    // console.log()
    root.render(
      <App
        remetente={remetente || ""}
        linksList={linksList}
      />
    );

    sessionStorage.setItem(sessionStorageIsRenderingUILabel, 'true')

  }

}

if (!document.getElementById(rootDivId)) {
  const rootDiv = document.createElement('div');
  rootDiv.id = rootDivId;

  Object.assign(rootDiv.style, {
    position: 'fixed',
    top: '50px',
    right: '20px',
    zIndex: '9999',
    // backgroundColor: 'green',
    // backgroundColor: 'red',
    // backgroundColor: 'orange',
    backgroundColor: getBackgroundColor(),
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
