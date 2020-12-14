import React from 'react';
import Loading from "../core-components/loading";
import CustomComponent from "../lib-core/Component"

const asyncComponent = (getComponent) => {
    // return AsyncComponent class component
    return class AsyncComponent extends CustomComponent {
        _willUnmount = false;

        static Component = null;

        state = {
            Component: AsyncComponent.Component // first time similar to static Component = null
        };

        componentWillMount() {
            if (!this.state.Component) {
                // if this.state.Component is true value then getComponent promise resolve with .then() method
                // For simplicity, I haven't caught an error, but you can catch any errors.
                getComponent().then(({default: Component}) => {
                    AsyncComponent.Component = Component;
                    if (!this._willUnmount)
                        this.setState({Component}); // update this.state.Component
                });
            }
        }

        componentWillUnmount() {
            this._willUnmount = true;
        }

        render() {
            const {Component} = this.state; // destructing Component from this.state
            if (Component) {
                // if Component is truthy value then return Component with props
                return <Component {...this.props} />;
            } else {
                return <Loading/>
            }
        }
    };
};

export default asyncComponent;
