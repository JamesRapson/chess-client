import React, { Component } from "react";
import { ChessGame } from "./ChessGame";

import "./custom.css";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return <ChessGame></ChessGame>;
    }
}
