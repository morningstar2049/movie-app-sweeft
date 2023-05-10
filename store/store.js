export class Store {
  constructor(state) {
    this.state = state;
  }

  useState(updater) {
    return (newState) => {
      if (newState !== this.state) {
        this.state = newState;
        updater(newState);
      }
    };
  }
}
