import React from "react";
import "./App.css";
import * as contactService from './ContactService';
import { Button } from 'primereact/button';
        

const sessionStorageBackgroundColorLabel = 'backgroundColor'

type AppProps = {
  remetente?: string; // opcional — pode ser omitido
  linksList?: string[]; // opcional — pode ser omitido
};

type AppState = {
  unsavedContact?: boolean;
  callApi?: boolean;
};

// class App extends Component<AppProps> {
class App extends React.Component<AppProps, AppState> {

  constructor(props: any){
    // console.log("constructor!")
    super(props)

    this.state ={
      unsavedContact: false,
      callApi: false,
    }

  }  

  componentDidMount() {
    // console.log("componentDidMount")
    this.runMount()
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    // console.log("componentDidUpdate")
  }
  
  runMount = () => {

    if(!this.state.callApi && this.props.remetente){
      console.log("deve chamar API para o remetente: ", this.props.remetente);
      this.setState({callApi: true})

      contactService.getContact(this.props.remetente).then(async contact => {
        if (contact) {
          console.log("contato encontrado: ", contact)
          sessionStorage.setItem(sessionStorageBackgroundColorLabel, 'green')
        } else {
          console.log("contato NÃO encontrado:", contact);
          sessionStorage.setItem(sessionStorageBackgroundColorLabel, 'orange')
          await this.setState({unsavedContact: true})
          console.log("state: ", this.state)
          // contactService.saveContact(this.props.remetente!, 'trusted');
        }

        contactService.findSimilarContacts(this.props.remetente!).then(similars => {
          console.log("contatos similares: ", similars)
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
    console.log("ueee")
    // console.log("save contact ", this.props.remetente)
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


    const renderUnsavedContactButtons = () => {
      return(
        <Button
          label="Salvar Contato"
          icon="pi pi-check"
          onClick={this.handleSave}
        />
      )
    }

    const renderUnsavedContactButtonsOld = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <div className="tooltip-wrapper">
            <button
              onClick={this.handleSave}
              title="Salvar Contato"
              style={{
                backgroundColor: "#2ecc71",
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
              aria-label="Salvar como confiável"
            >
              {/* ✅ */}
            </button>
            {/* <div className="tooltip">Salvar como confiável</div> */}
          </div>

          <div className="tooltip-wrapper">
            <button
              // onClick={handleBlock}
              title="Bloquear Contato"
              style={{
                backgroundColor: "#e74c3c",
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
              aria-label="Bloquear contato"
            >
              {/* ⛔ */}
            </button>
            {/* <div className="tooltip">Bloquear contato</div> */}
          </div>
        </div>
      );
    };


    const renderButtons = () => {
      if(this.state.unsavedContact){
        return renderUnsavedContactButtons()
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
