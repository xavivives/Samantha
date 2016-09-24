import React from 'react';
import Connector from './connector.js';
import Hitag from './hitag.js';
import TextField from 'material-ui/TextField';
//import AutoComplete from 'material-ui/AutoComplete';

export default class PopupPage extends React.Component
{
    constructor(props)
    {
        super(props);

        var that = this;
        this.connector = new Connector();
        this.closePopup = this.closePopup.bind(this);
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);

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

    closePopup()
    {
        window.close();
    }

    onSearchTextChanged()
    {

    }

    onHandleUpdateInput (value)
    {
        this.setState({
            dataSource: [
            value,
                value + value,
                value + value + value,
            ],
        });
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

                    <Hitag hitag={["hola > ","musica" ,"flame"]}></Hitag>
                    <Hitag hitag={["Rock","flow","flame", "paraigues"]}></Hitag>
                    <Hitag hitag={["flame"]}></Hitag>
                    <Hitag hitag={["Lydia","memory"]}></Hitag>
                </div>

                <div style={{whiteSpace: 'nowrap'}}>
                    <p style ={style}> {this.state.status.message} </p>
                </div>
            </div>
        );
    }
}
