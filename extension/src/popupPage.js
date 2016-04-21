import React from 'react';
import Connector from './connector.js';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import GetMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import theme from './theme.js';

export default class PopupPage extends React.Component
{
    constructor(props)
    {
        super(props);

        var that = this;
        this.connector = new Connector();
        this.closePopup = this.closePopup.bind(this);

        this.state = {
            status:
            {
                statusType:"normal",
                message:"Saving..."
            }
        };

        this.connector.registerEvent("updatePopupStatus", function(status) {
            that.updatePopupStatus(status);
        });

        this.connector.sendMessage("saveUrl");      
    }

    updatePopupStatus(status)
    {
        this.setState({status: status});
        setTimeout(this.closePopup,2000);
    }

    getChildContext()
    {
        return { muiTheme: GetMuiTheme(theme)};
    }

    closePopup()
    {
        window.close();
    }

    render()
    {
        var style ={};

        if(this.state.status.statusType == "error")
             style ={color: 'red'}
        else if(this.state.status.statusType =="ok")
             style ={color: 'green'}
        else
            style ={color: 'gray'}
        
        return(
            <div>
                <div style={{whiteSpace: 'nowrap'}}>
                    <p style ={style}> {this.state.status.message} </p>
                </div>
            </div>
        );
    }
}

PopupPage.childContextTypes = {
        muiTheme: React.PropTypes.object
    }