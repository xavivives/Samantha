import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tag extends React.Component
{
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

        var htag = ["hola","musica","flame"];
        return(
            <div>
                <div style={style}>
                
                
                {htag.map(function(tag, index){

                        if(index==htag.length-1)
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
