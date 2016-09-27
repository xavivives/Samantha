import React from 'react';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';


export default class PopupPage extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {

        return(
            <HotKeys>  
                <SelectableList asList= {true} children = {this.props.hitags} encapsulated = {false}/> 
            </HotKeys>             
        );
    }
}
//