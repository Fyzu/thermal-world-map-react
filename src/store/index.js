import { applyMiddleware, createStore, Store } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "reducers";

export const configureStore = (initialState): Store => {
    const store: Store = createStore(
        rootReducer, initialState,
        applyMiddleware(
            thunk, createLogger()
        )
    );

    if (module.hot) {
        module.hot.accept("../reducers", () => {
            const nextRootReducer = require("../reducers");
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
};