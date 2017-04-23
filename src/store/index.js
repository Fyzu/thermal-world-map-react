/* @flow */
import type { Store } from "redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "reducers";

export const configureStore = (initialState: any): Store<*, *> => {
    const store: Store<*, *> = createStore(
        rootReducer, initialState,
        applyMiddleware(
            thunk, createLogger()
        )
    );

    if (module.hot) {
        // $FlowFixMe
        module.hot.accept("../reducers", () => {
            const nextRootReducer = require("../reducers");
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
};