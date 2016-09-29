import React from 'react';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';


export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
           isOpened :true
        }

        return props;
    }

    constructor(props)
    {
        super(props);
    }

    render()
    {
        if(!this.props.isOpened)
        {
            return null;        }
        else
        {
            return(
                <HotKeys>  
                    <SelectableList asList= {true} children = {this.props.hitags} encapsulated = {false}/> 
                </HotKeys>             
            );
        }
            
    }
}
//