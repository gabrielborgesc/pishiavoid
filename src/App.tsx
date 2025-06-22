import React from "react";
import "./App.css";

type AppProps = {
  remetente?: string; // opcional — pode ser omitido
  linksList?: string[]; // opcional — pode ser omitido
};

type AppState = {
  // remetente?: string;
};

const sessionStorageCallApiLabel = 'callApi'

// class App extends Component<AppProps> {
class App extends React.Component<AppProps, AppState> {

  constructor(props: any){
    super(props)
    // this.state = {
    //   remetente: props.remetente,
    // };
  }  

  componentDidMount() {
    this.runMount()
    // Simula uma atualização depois de 3 segundos
  }
  
  runMount(){
    if(!sessionStorage.getItem(sessionStorageCallApiLabel) && this.props.remetente){
      console.log("deve chamar API para o remetente: ", this.props.remetente);
      sessionStorage.setItem(sessionStorageCallApiLabel, 'true')
    }
  }

  // componentDidUpdate(prevProps: AppProps, prevState: AppState) {
  //   console.log("componentDidUpdate")
  //   // if (prevState.remetente !== this.state.remetente) {
  //   //   console.log("componentDidUpdate: remetente mudou para", this.state.remetente);
  //   // }
  // }

  constroiMensagemLinks = () => {
    let linksMessage = `Links presentes no email:\n\n`;

    this.props.linksList?.forEach(link => {
      linksMessage += `- ${link}\n\n`;
    });

    return linksMessage;
  };

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
