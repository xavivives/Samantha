import React from 'react';
import Connector from './connector.js';
import Hitag from './hitag.js';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; 

export default class PopupPage extends React.Component
{
    constructor(props)
    {
        super(props);

        var that = this;
        this.connector = new Connector();
        this.closePopup = this.closePopup.bind(this);
        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onTagInputKeyDown = this.onTagInputKeyDown.bind(this);

        this.state = {
            status:
            {
                statusType:"normal",
                message:"Saving..."
            },
            tagInput:"",
            hitags:[]
        };


        this.connector.registerEvent("updatePopupStatus", function(status) {
            that.updatePopupStatus(status);
        });

        this.connector.sendMessage("saveUrl");   
    }

    updatePopupStatus(status)
    {
        this.setState({status: status});
        setTimeout(this.closePopup,200000);
    }

    closePopup()
    {
        window.close();
    }

    onTagInputChanged(event)
    {
        this.setState({
            tagInput: event.target.value,
          });
    }

    onTagInputKeyDown(event)
    {
        if(event.keyCode==13)
        {
            var newHitag = event.target.value;
            var hitags = this.state.hitags;
            hitags.push([newHitag]);

            this.setState({
                hitags: hitags,
                tagInput: "",
          });
        }
    }

    render()
    {
        var style ={};

        if(this.state.status.statusType == "error")
             style ={color: 'red'}
        else if(this.state.status.statusType =="ok")
             style ={color: 'green'}
        else
            style ={color: 'gray'}
        
        return(
            <MuiThemeProvider>
            <div style={{width: 300}}>

                <div style={{whiteSpace: 'nowrap'}}>
                    <p style ={style}> {this.state.status.message} </p>
                </div>

                <TextField
                    hintText="Add tags..."
                    defaultValue = {this.state.defaultSearch}
                    onChange={this.onTagInputChanged}
                    onKeyDown = {this.onTagInputKeyDown}
                    fullWidth={true}
                    value = {this.state.tagInput}
                />
            
                <div style={{display: 'flex', flexWrap:'wrap'}}>
                     {this.state.hitags.map(function(hitag, index, originalArray){
                        return  <Hitag hitag={hitag}></Hitag>
                        })
                    }    
                </div>
                
            </div>
            </MuiThemeProvider>
        );
    }
}
