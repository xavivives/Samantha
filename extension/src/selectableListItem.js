import React from 'react';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            children: [],
            enabled : true,
            onItemClicked : this.onItemClicked,
            index : -1,
            isSelected:false
        }

        return props;
    }

    onItemClicked(index)
    {
        console.log("Clicked Item '"+index+". Set 'onClick' prop");
    }

    constructor(props)
    {
        super(props);

        this.onClick= this.onClick.bind(this);
        this.onItemClicked= this.onItemClicked.bind(this);
        this.onMouseEnter= this.onMouseEnter.bind(this);
        this.onMouseLeave= this.onMouseLeave.bind(this);

        this.state =
        {
           isHovering : false
        };
    }

    onClick()
    {
        this.props.onItemClicked(this.props.index);
    }

    onMouseEnter()
    {
        this.setState(
        {
            isHovering:true
        })
    }

    onMouseLeave()
    {
        this.setState(
        {
            isHovering:false
        })
    }

    render()
    {
        var style =
        {
            
        };

        var that = this;

        if(this.props.enabled)
        {
            if(this.props.isSelected)
            {
                style.backgroundColor="yellow";
            }
            else
            {
                if(this.state.isHovering)
                {
                    style.backgroundColor="red";
                }
                else
                {
                    style.backgroundColor="transparent";
                }
            }
        }
        else
        {
            style.backgroundColor ="grey";
        }

        return(        
            <div style={style}
                onClick = {this.onClick}
                onMouseEnter = {this.onMouseEnter}
                onMouseLeave = {this.onMouseLeave}
                >
                 {this.props.children}
            </div>
        );  
    }
}