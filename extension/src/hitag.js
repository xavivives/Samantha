import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tag extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            hitag: ['empty'],
            encapsulated:true
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        var that = this;

        this.state = {
            status:
            {
                statusType:"normal",
                message:"Saving..."
            }
        };
    }

    render()
    {
        var style ={};
        style ={
            display:'inline-block',
            //backgroundColor: 'rgba(230,220,170,0.4)',
            borderRadius:3,
            paddingLeft:5, 
            paddingRight:5, 
            paddingTop:3,
            paddingBottom:3,
            margin:2,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'rgba(0,0,0,0.2)',
        }

        if(!this.props.encapsulated)
        {
            style.borderStyle = 'none';
        }

        var hitagChain = [];

        this.props.hitag.map(function(tag, index, originalArray)
        { 
            hitagChain.push(<div style={{display: 'inline-block'}}> {tag}</div>);

            if(index!= originalArray.length-1)
                 hitagChain.push( <FontAwesome name='angle-right' style={{paddingLeft:3, paddingRight:3, opacity:0.4 }}/>); 
                       
        });
        
        return(
            <div style={style}>           
                {hitagChain}        
            </div>
        );
    }
}
