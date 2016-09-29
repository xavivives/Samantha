import React from 'react';
import Hitag from './hitag.js';
import {List, ListItem} from 'material-ui/List';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            hitags: [[]],
            encapsulated:true,
            stack:false,
            asList:false
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

        if(this.props.asList)
        {
            return(        
                <List ref= "List">
                     {that.props.hitags.map(function(hitag, index, originalArray){
                        return  <ListItem>
                                    <Hitag hitag={hitag} encapsulated ={that.props.encapsulated}/>
                                </ListItem>
                        })
                    }    
                </List>
            );
        }
        else
        {
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
}