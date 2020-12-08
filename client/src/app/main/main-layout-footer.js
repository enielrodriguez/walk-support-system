import React              from 'react';
import classNames         from 'classnames';

class MainLayoutFooter extends React.Component {

    render() {
        return (
            <div className={this.getClass()}>
                <div className="main-layout-footer__powered">
                    SitiGroup™ Support System
                </div>
            </div>
        );
    }

    getClass() {
        let classes = {
            'main-layout-footer': true
        };

        return classNames(classes);
    }
}

export default MainLayoutFooter;
