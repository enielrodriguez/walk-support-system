import React from "react";

class Component extends React.Component {
    _canSetState = true;

    componentWillUnmount() {
        this._canSetState = false;
    }

    setState(state, callback) {
        if (this._canSetState)
            super.setState(state, callback);
    }
}

export default Component;
