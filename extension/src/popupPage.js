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
import HitagUtils from './hitagUtils.js';
import FontAwesome from 'react-fontawesome';

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
                message:"Saving...",
            },
            atom:{},
            atomHitags:[]
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

        this.connector.registerEvent("updatePopupAtom", function(atom) {
            that.updatePopupAtom(atom);
        });

        this.connector.sendMessage("saveUrl");

        this.onHelpClicked = this.onHelpClicked.bind(this);
    }

    updatePopupStatus(status)
    {
        this.setState({status: status});
        setTimeout(this.closePopup,200000);
    }

    updatePopupAtom(atom)
    {
        var atomHitags=[];
        if(atom.relations && atom.relations.hitags)
            HitagUtils.hitagNodeToHitagList(atom.relations.hitags, atomHitags);
        
        this.setState({atom: atom, atomHitags:atomHitags});     
    }

    closePopup()
    {
        window.close();
    }

    onHelpClicked()
    {
        this.connector.sendMessage("showHelp");
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
                    <div style={{minWidth: 350, minHeight: 350}}>

                        <div style={{whiteSpace: 'nowrap'}}>
                            <p style ={messageStyle}> {this.state.status.message} </p>
                        </div>

                        <HitagsAutocomplete connector={this.connector} isOpened={true}/>
                        <HitagsDisplay hitags= {this.state.atomHitags} encapsulated={true}/>
                        <FontAwesome onClick = {this.onHelpClicked} size= {"2x"} name='question-circle' style={{paddingLeft:3, paddingRight:3, opacity:0.4 }}/>
                    </div>
                </MuiThemeProvider>
            </HotKeys>
        );
    }
}