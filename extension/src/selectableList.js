import React from 'react';
import Hitag from './hitag.js';
import SelectableListItem from './selectableListItem.js';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            onItemSelected: this.defaultOnItemSelected,
            children: [],
            selectedIndex:-1
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
        this.defaultOnItemSelected= this.defaultOnItemSelected.bind(this);
        this.setState= this.setState.bind(this);
    }

    defaultOnItemSelected(index)
    {
        console.log("Selected "+index+". Set onItemSelected prop");
    }

    isItemSelected(index)
    {
        return index == this.props.selectedIndex;
    }

    onItemClicked( index)
    {
       this.props.onItemSelected(index);
    }

    render()
    {
        var style ={
            display: 'flex',
            flexDirection:'column'
        };
        var that = this;

        return(   
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
        );  
    }
}