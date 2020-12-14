import React from 'react';

class CustomComponent extends React.Component {
    _willUnmount = false;

    componentWillUnmount() {
        this._willUnmount = true;
    }

    setState(state, callback) {
        if (!this._willUnmount)
            super.setState(state, callback);
    }
}

export default CustomComponent;
