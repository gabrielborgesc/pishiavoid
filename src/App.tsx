import React from "react";
import "./App.css";
import * as contactService from './ContactService';
import { Button } from 'primereact/button';
        

const sessionStorageBackgroundColorLabel = 'backgroundColor'
const trusted = 'trusted'
const blocked = 'blocked'
const unsaved = 'unsaved'

type AppProps = {
  remetente?: string; // opcional — pode ser omitido
  linksList?: string[]; // opcional — pode ser omitido
};

type AppState = {
  contactStatus?: string;
  callApi?: boolean;
};

// class App extends Component<AppProps> {
class App extends React.Component<AppProps, AppState> {

  constructor(props: any){
    // console.log("constructor!")
    super(props)

    this.state ={
      contactStatus: unsaved,
      callApi: false,
    }

  }  

  componentDidMount() {
    // console.log("componentDidMount")
    if(!this.state.callApi && this.props.remetente){
      this.runMount()
    }
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    // console.log("componentDidUpdate")
  }
  
  runMount = () => {

    if(this.props.remetente){
      // console.log("deve chamar API para o remetente: ", this.props.remetente);
      this.setState({callApi: true})

      contactService.getContact(this.props.remetente).then(async contact => {
        if (contact) {
          sessionStorage.setItem(sessionStorageBackgroundColorLabel, contact.type === trusted ? 'green' : 'red')
          await this.setState({contactStatus: contact.type})
        } else {
          sessionStorage.setItem(sessionStorageBackgroundColorLabel, 'orange')
          await this.setState({contactStatus: unsaved})
        }

        contactService.findSimilarContacts(this.props.remetente!).then(similars => {
          // console.log("contatos similares: ", similars)
          if (similars.length > 0) {
            // console.log("Sender looks similar to:", similars.map(s => s.email));
          }
        });
      });

    }

  }

  constroiMensagemLinks = () => {
    let linksMessage = `Links presentes no email:\n\n`;

    this.props.linksList?.forEach(link => {
      linksMessage += `- ${link}\n\n`;
    });

    return linksMessage;
  };

  handleSave = () => {
    contactService.saveContact(this.props.remetente!, trusted);

    setTimeout(() => 
      this.runMount(),
      500
    )
  }

  handleBlock = () => {
    contactService.saveContact(this.props.remetente!, blocked);

    setTimeout(() => 
      this.runMount(),
      500
    )
  }

  handleDelete = () => {
    contactService.deleteContact(this.props.remetente!);

    setTimeout(() => 
      this.runMount(),
      500
    )
  }

  render() {

    const renderRemetente = () => {
      if(this.props.remetente){
        return (
          <div
            id="phishiavoid-info"
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "8px",
              borderRadius: "8px",
              fontSize: "14px",
              margin: "10px",
            }}
          >
            {`Remetente: ${this.props.remetente}`}
          </div>
        )
      }
    }


    const renderButton = (title: string, color: string, icon: any, action: any) => {
      return (
          <div className="tooltip-wrapper">
            <button
              onClick={action}
              title={title}
              style={{
                backgroundColor: color,
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "18px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
              aria-label={title}
            >
              {icon}
            </button>
            {/* <div className="tooltip">Salvar como confiável</div> */}
          </div>        
      )
    }

    const renderBlockedContactButtons = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          {renderButton("Desbloquear", "#2980b9", '🔓', this.handleDelete)}

        </div>        
      )
    }

    const renderTrustedContactButton = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >

          {renderButton("Remover Contato", "#e74c3c", "⛔", this.handleDelete)}

        </div>        
      )      
    }

    const renderUnsavedContactButtons = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >

          {renderButton("Salvar Contato", "#2ecc71", '✅', this.handleSave)}
          {renderButton("Bloquear Contato", "#e74c3c", "⛔", this.handleBlock)}

        </div>
      );
    };


    const renderButtons = () => {
      switch(this.state.contactStatus){
        case unsaved:
          return renderUnsavedContactButtons()
        case trusted:
          return renderTrustedContactButton()
        case blocked:
          return renderBlockedContactButtons()
      }
    }

    const renderLinks = () => {
      if (this.props.linksList) {
        return (
          <div
            id="phishiavoid-info"
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "8px",
              borderRadius: "8px",
              fontSize: "14px",
              margin: "10px",
              whiteSpace: "pre-wrap",       //<-- ESSENCIAL PARA '\n' FUNCIONAR
              wordBreak: "break-all",       // <- quebra palavras grandes como URLs
              overflowWrap: "break-word",   // <- quebra em espaços permitidos
              maxHeight: "15rem",           // <- limite vertical com scroll
              overflowY: "auto",            // <- scroll se passar do limite
            }}            
          >
            {this.constroiMensagemLinks()}
          </div>
        );
      }
    }    

    const renderBody = () => {

      return (
        <div className="App">
            {renderRemetente()}
            {renderButtons()}
            {renderLinks()}
        </div>
      );
    };


    return (
      <div >
        {renderBody()}
      </div>
    );
  }
}

export default App;
