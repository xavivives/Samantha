import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tag extends React.Component
{

    
    static get defaultProps()
    {
        var props = 
        {
            hitag: ['empty']
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

        
        return(
            <div>
                <div style={style}>
                
                
                {this.props.hitag.map(function(tag, index, originalArray){

                        if(index==originalArray.length-1)
                            return <div style={{display: 'inline-block'}}> {tag}</div>
                        else
                            return <div style={{display: 'inline-block'}}> 
                                    <div style={{display: 'inline-block'}}> {tag}  </div>
                                    <FontAwesome name='angle-right' style={{paddingLeft:3, paddingRight:3, opacity:0.4 }}/>
                                </div>
                    })
                }
                </div>
            </div>
        );
    }
}
