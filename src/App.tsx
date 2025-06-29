import React from "react";
import "./App.css";
import * as contactService from './ContactService';
import { Button } from 'primereact/button';
        

const trusted = 'trusted'
const blocked = 'blocked'
const unsaved = 'unsaved'

const trustedLabel = 'TRUSTED'
const blockedLabel = 'BLOCKED'
const newLabel = 'NEW'

type AppProps = {
  remetente?: string; // opcional — pode ser omitido
  linksList?: string[]; // opcional — pode ser omitido
};

type AppState = {
  contactStatus?: string;
  callApi?: boolean;
  similarSenders?: contactService.Contact[],
  hiden?: boolean,
};

// class App extends Component<AppProps> {
class App extends React.Component<AppProps, AppState> {

  constructor(props: any){
    // console.log("constructor!")
    super(props)

    this.state ={
      contactStatus: unsaved,
      callApi: false,
      hiden: false
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
          this.changeBackGroundColor(contact.type === trusted ? 'green' : 'red')
          await this.setState({contactStatus: contact.type})
        } else {
          this.changeBackGroundColor('orange')
          await this.setState({contactStatus: unsaved})
        }

        contactService.findSimilarContacts(this.props.remetente!).then(similars => {
          // console.log("contatos similares: ", similars)
          if (similars.length > 0) {
            this.setState({similarSenders: similars})
            // console.log("Sender looks similar to:", similars.map(s => s.email));
          }
        });
      });

    }

  }

  changeBackGroundColor = (color: string) => {
    const rootDiv = document.getElementById('pishiavoid-root');
    if (rootDiv) {
      rootDiv.style.backgroundColor = color;
    }
  }

  constroiMensagemLinks = () => {
    let linksMessage = `Links present in the email:\n\n`;

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

  getContactStatus = () => {
    let statusMessage = "This is a "
      switch(this.state.contactStatus){
        
        case unsaved:
          statusMessage += newLabel
          break

        case trusted:
          statusMessage += trustedLabel
          break

        case blocked:
          statusMessage += blockedLabel
          break

      }

    return statusMessage += " sender"
  }

  getSimilarTrustedSenders = () => {
    let message = `Simliar ${trustedLabel} senders: \n`
    this.state.similarSenders?.forEach(similarSender => {
      if(similarSender.type === trusted){
        message += `- ${similarSender.email}\n`
      }
    })
    return message
  }

  getSimilarBlockedSenders = () => {
    let message = `Simliar ${blockedLabel} senders: \n`
    this.state.similarSenders?.forEach(similarSender => {
      if(similarSender.type === blocked){
        message += `- ${similarSender.email}\n`
      }
    })
    return message
  }

  handleClose = () => {
    this.setState({hiden: true})
  }

  render() {

    const renderContactStatus = () => {
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
            {this.getContactStatus()}
          </div>
        )
      }
    }

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
            {`Sender: ${this.props.remetente}`}
          </div>
        )
      }
    }

    const renderSimilarSendersComponent = (message: string) => {
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
            }}
          >
            {message}
          </div>
        )
    }

    const renderSimilarSenders = () => {
      if(this.props.remetente && this.state.contactStatus === unsaved){
        return (
          <>
            {renderSimilarSendersComponent(this.getSimilarTrustedSenders())}
            {renderSimilarSendersComponent(this.getSimilarBlockedSenders())}
          </>
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
          {renderButton("Unlock", "#2980b9", '🔓', this.handleDelete)}

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

          {renderButton("Remove Contact", "#e74c3c", "⛔", this.handleDelete)}

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

          {renderButton("Trust Contact", "#2ecc71", '✅', this.handleSave)}
          {renderButton("Block Contact", "#e74c3c", "⛔", this.handleBlock)}

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

    const renderCloseButton = () => {
      return (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "2px" }}>
          <button
            onClick={this.handleClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "16px",
              color: "white",
              cursor: "pointer",
            }}
            title="Close"
          >
            ✖
          </button>
        </div>
      )
    }

    const renderBody = () => {
      if(!this.state.hiden)
      return (
        <div className="App">
            {renderCloseButton()}
            {renderRemetente()}
            {renderContactStatus()}
            {renderButtons()}
            {renderSimilarSenders()}
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
