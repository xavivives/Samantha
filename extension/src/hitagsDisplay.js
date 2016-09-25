import React from 'react';
import Hitag from './hitag.js';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            hitags: [[]],
            encapsulated:true,
            stack:false
        }

        return props;
    }

    constructor(props)
    {
        super(props);
    }

    render()
    {
        var style ={
            display: 'flex',
            flexWrap:'wrap',
            flexDirection:'row'
        };

        if(this.props.stack)
            style.flexDirection = 'column';

        var that = this;
        return(
            
            <div style={style}>
                 {that.props.hitags.map(function(hitag, index, originalArray){
                    return  <Hitag hitag={hitag} encapsulated ={that.props.encapsulated} ></Hitag>
                    })
                }    
            </div>

        );
    }
}