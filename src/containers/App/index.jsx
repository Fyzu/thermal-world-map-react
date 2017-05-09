/* @flow */
import React, { PureComponent } from "react";
import * as PropTypes from "prop-types";
import { AppBar } from "material-ui";
import "./styles.pcss";

class App extends PureComponent {

    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        const { children } = this.props;
        return (
            <div className="app">
                <AppBar className="app-bar"
                    title="Thermal world map"
                    iconClassNameLeft="app-logo" />
                <div className="app-body">
                    {children}
                </div>
                <footer className="app-footer">
                    <div className="app-footer-copyright">
                        © 2017 Dmitry Petrov
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;
