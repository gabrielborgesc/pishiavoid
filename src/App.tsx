import React, { Component } from "react";
import "./App.css";

type AppProps = {
  remetente?: string; // opcional — pode ser omitido
};

type AppState = {
  remetente?: string;
};

// class App extends Component<AppProps> {
class App extends React.Component<AppProps, AppState> {

  constructor(props: any){
    super(props)
    this.state = {
      remetente: props.remetente,
    };      
  }  

  componentDidMount() {
    console.log("componentDidMount");
    // Simula uma atualização depois de 3 segundos
    setTimeout(() => {
      this.setState({ remetente: "novo remetente" });
    }, 3000);
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    console.log("componentDidUpdate")
    if (prevState.remetente !== this.state.remetente) {
      console.log("componentDidUpdate: remetente mudou para", this.state.remetente);
    }
  }  

  render() {
    return (
      <div className="App">
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
          {this.props.remetente
            ? `Remetente: ${this.props.remetente}`
            : "Analisando remetente..."}
        </div>
      </div>
    );
  }
}

export default App;
