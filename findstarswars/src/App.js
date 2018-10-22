import React from "react";
import "./App.scss";
import Immutable from "immutable";
import axios from "axios";

class Header extends React.Component {
  render() {
    return (
      <nav className="header">
        <div className="header-content">Personagens Star Wars</div>
      </nav>
    );
  }
}

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      showAnswer: false
    };
  }

  render() {
    const content = this.state.showAnswer
      ? this.props.backContent
      : this.props.frontContent;
    const cardClass = this.state.showAnswer ? "back" : "";
    const contentClass = this.state.showAnswer ? "back" : "front";

    return (
      <div>
        <div
          className={`card ${cardClass}`}
          onClick={() => this.setState({ showAnswer: !this.state.showAnswer })}
        >
          <span className="card_counter title">
            {this.props.cardNumber + 1}
          </span>
          <div className="card_div">
            <div className={`card_content--${contentClass}`}>{content}</div>
          </div>
        </div>

        <div className={`card_actions ${"active"}`}>
          <div
            className="card_prev-button"
            onClick={() => {
              this.props.showPrevCard();
              this.setState({ showAnswer: false });
            }}
          >
            Anterior
          </div>
          <div
            className="card_next-button"
            onClick={() => {
              this.props.showNextCard();
              this.setState({ showAnswer: false });
            }}
          >
            Próximo
          </div>
        </div>
      </div>
    );
  }
}

async function getPeople() {
  const response = await axios.get("https://swapi.co/api/people/");
  return response.data.results;
}

async function getSpecie(url) {
  const response = await axios.get(url);
  return response.data.name;
}

async function getStarship(url) {
  const response = await axios.get(url);
  return response.data;
}

class CardContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      cards: Immutable.fromJS([]),
      cardNumber: 0,
      showAnswer: false
    };

    this.getPeoples = this.getPeoples.bind(this);
    this.boundCallback = this.hideCreateCard.bind(this);
    this.boundShowPrevCard = this.showPrevCard.bind(this);
    this.boundShowNextCard = this.showNextCard.bind(this);
  }

  componentDidMount = () => {
    this.getPeoples();
  };

  getPeoples = () => {
    const results = getPeople();
    results.then(aux => {
      aux.map(card => {
        card.starships.map(ship => {
          const ss = getStarship(ship);
          ss.then(data => {
            return (card.starships = data);
          });
          return ss;
        });

        const aux = getSpecie(card.species);
        aux.then(data => {
          card.specieName = data;
        });
      });

      this.setState({ cards: aux });
      console.log(aux);
    });
  };

  hideCreateCard() {
    this.setState({ showModal: false });
  }

  showNextCard() {
    if (this.state.cardNumber + 1 !== this.state.cards.length) {
      this.setState({ cardNumber: (this.state.cardNumber += 1) });
    }
  }

  showPrevCard() {
    if (this.state.cardNumber !== 0) {
      this.setState({ cardNumber: (this.state.cardNumber -= 1) });
    }
  }

  generateCards() {
    const cards = this.state.cards;
    const cardsList = cards.map(card => {
      return (
        <Card
          frontContent={
            <div>
              <div className="title">
                <span className="name">PERSONAGEM: {card.name}</span>
              </div>
              <div className="container">
                <div className="container_l">
                  <span className="inf">Altura:</span>
                  <br />
                  <span className="inf">Peso:</span>
                  <br />
                  <span className="inf">Cor dos olhos:</span>
                  <br />
                  <span className="inf">Gênero:</span>
                  <br />
                  <span className="inf">Espécie:</span>
                  <br />
                </div>
                <div className="container_r">
                  <span className="inf">{card.height}</span>
                  <br />
                  <span className="inf">{card.mass}</span>
                  <br />
                  <span className="inf">{card.eye_color}</span>
                  <br />
                  <span className="inf">{card.gender}</span>
                  <br />
                  <span className="inf">{card.specieName}</span>
                  <br />
                </div>
              </div>
            </div>
          }
          backContent={
            <div>
              <div className="title">
                <span className="name">STARSHIP: {card.starships.name}</span>
              </div>
              <div className="container">
                <div className="container_l">
                  <span className="inf">Modelo:</span>
                  <br />
                  <span className="inf">Fabricante:</span>
                  <br />
                  <span className="inf">Passageiros:</span>
                  <br />
                  <span className="inf">Comprimento:</span>
                  <br />
                  <span className="inf">Classe:</span>
                  <br />
                  <span className="inf">Alinhamento:</span>
                  <br />
                </div>
                <div className="container_r">
                  <span className="inf">{card.starships.model}</span>
                  <br />
                  <span className="inf">{card.starships.manufacturer}</span>
                  <br />
                  <span className="inf">{card.starships.passengers}</span>
                  <br />
                  <span className="inf">{card.starships.length}</span>
                  <br />
                  <span className="inf">{card.starships.vehicle_class}</span>
                  <br />
                  <span className="inf">{card.starships.alignment}</span>
                  <br />
                </div>
              </div>
            </div>
          }
          showNextCard={this.boundShowNextCard}
          showPrevCard={this.boundShowPrevCard}
          cardNumber={this.state.cardNumber}
        />
      );
    });
    return cardsList[this.state.cardNumber];
  }

  render() {
    return <div>{this.generateCards()}</div>;
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="content-wrapper">
          <CardContainer />
        </div>
      </div>
    );
  }
}

export default App;
