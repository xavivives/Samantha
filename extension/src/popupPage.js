import React from 'react';
import Connector from './connector.js';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import GetMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Theme from './theme.js';
import Hitag from './hitag.js';

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
        setTimeout(this.closePopup,200000);
    }

    getChildContext()
    {
        return { muiTheme: GetMuiTheme(Theme)};
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
            <div style={{width: 200}}>
                <div style={{display: 'flex', flexWrap:'wrap'}}>

                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                    <Hitag></Hitag>
                </div>

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