import React from 'react';
import Hitag from './hitag.js';
import SelectableListItem from './selectableListItem.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            children: [],
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        this.state = {
            selectedItemIndex:-1
        };

        this.isItemSelected= this.isItemSelected.bind(this);
        this.setState= this.setState.bind(this);

        this.onAction = this.onAction.bind(this);
        this.onMoveUp = this.onMoveUp.bind(this);
        this.onMoveDown = this.onMoveDown.bind(this);

        this.hotKeyshandlers = {
          'action': this.onAction,
          'moveUp': this.onMoveUp,
          'moveDown':this.onMoveDown,
          'moveLeft': this.onMoveUp,
          'moveRight':this.onMoveDown,
        };
    }

    onAction(e)
    {
        console.log("action");
    }

    onMoveUp(e)
    {
        if(this.state.selectedItemIndex>0)
        {
            this.setState({
                selectedItemIndex: this.state.selectedItemIndex - 1
            })
        }
    }
    
    onMoveDown(e)
    {
        if(this.state.selectedItemIndex< this.props.children.length+1)
        {
            this.setState({
                selectedItemIndex: this.state.selectedItemIndex + 1
            })
        }
    }

    isItemSelected(index)
    {
        return index == this.state.selectedItemIndex;
    }

    onItemClicked( index)
    {
        this.setState({
            selectedItemIndex:index
        })
    }

    render()
    {
        var style ={
            display: 'flex',
            flexDirection:'column'
        };
        var that = this;

        return(   
            <HotKeys  handlers={this.hotKeyshandlers}>     
                <div ref= "List" style={style}>
                     {that.props.children.map(function(child, index, originalArray){
                        return <SelectableListItem
                        index = {index}
                        isSelected = {that.isItemSelected(index)}
                        onItemClicked={that.onItemClicked.bind(that, index)}>

                                {child}
                            </SelectableListItem>
                        })
                    }    
                </div>
            </HotKeys>
        );  
    }
}