import React from 'react';
import Connector from './connector.js';
import Hitag from './hitag.js';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; 
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import HitagsDisplay from './hitagsDisplay.js';
import HitagsAutocomplete from './hitagsAutocomplete.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';

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
            },
        };

        this.muiTheme = getMuiTheme({
          palette: {
            textColor: cyan500,
          },
          listItem: {
            padding: 50,
          },
        });

        this.hotKeysMap = {
          'moveUp': 'up',
          'moveDown': 'down',
          'moveLeft': 'left',
          'moveRight': 'right',
          'action': ['return', 'enter']
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

    render()
    {
        var bodyStyle ={ margin:0, padding:10};
        var messageStyle ={};

        if(this.state.status.statusType == "error")
             messageStyle ={color: 'red'}
        else if(this.state.status.statusType =="ok")
             messageStyle ={color: 'green'}
        else
            messageStyle ={color: 'gray'}

        return(
            
            <HotKeys keyMap={this.hotKeysMap} style= {bodyStyle}>
                <MuiThemeProvider muiTheme={this.muiTheme}>
                    <div style={{minWidth: 350}}>

                        <div style={{whiteSpace: 'nowrap'}}>
                            <p style ={messageStyle}> {this.state.status.message} </p>
                        </div>

                        <HitagsAutocomplete hitags = {this.state.hitags} anchorElement={this.refs["tagInputContainer"]} isOpened={true}/>
                 
                    </div>
                </MuiThemeProvider>
            </HotKeys>
        );
    }
}

//<HitagsDisplay hitags = {this.state.hitags} encapsulated = {true} stack={false} />
