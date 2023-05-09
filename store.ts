let state: any = {};

type Updater<T> = (s1: T) => void;

const useState =
  <T>(updater: Updater<T>) =>
  (newState: T) => {
    // complex comparison algorithms
    if (newState !== state) {
      state = newState;
      updater(newState);
    }
  };

const setState = useState((currentState) => {
  // TODO: render to the DOM

  console.log("state updated: ", currentState);
  console.log("UPADING DOM...");
});

class Store<T> {
  private state: T;

  public useState = (updater: Updater<T>) => (newState: T) => {
    // complex comparison algorithms
    if (newState !== state) {
      this.state = newState;
      updater(newState);
    }
  };
}

const myStore = new Store<{ items: any[] }>();

function movieUpdater(state: unknown) {}

setInterval(() => {
  setState(Math.random());
}, 500);
