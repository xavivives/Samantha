import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import HitagsDisplay from './hitagsDisplay.js';

export default class PopupPage extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        console.log(this.props.anchorElement);
        return(
            <Popover
                open={true}
                anchorEl= {this.props.anchorElement}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}>

                <HitagsDisplay hitags = {this.props.hitags} encapsulated = {false} stack={true} />
          
            </Popover>             
        );
    }
}
