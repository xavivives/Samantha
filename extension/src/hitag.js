import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tag extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            hitag: ['empty'],
            encapsulated:true,
            inProgress:false,
            onNewTag:this.onNewTagDefault,
            onEnter:this.onEnterDefault,
            onNewTagChanged:this.onNewTagChangedDefault,
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        var that = this;

        this.state = {
            tagInProgress:"...new tag",
        };

        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onTagInputKeyDown = this.onTagInputKeyDown.bind(this);
        this.onNewTagDefault = this.onNewTagDefault.bind(this);
        this.onEnterDefault = this.onEnterDefault.bind(this);
        this.onNewTagChangedDefault = this.onNewTagChangedDefault.bind(this);
    }

    onNewTagChangedDefault(tagInput)
    {
        console.log("Override onTagInputChanged");
    }  

    onTagInputChanged(event)
    {
        var currentInput = event.target.value;

        if((currentInput.length>0) && (currentInput[0]==" "))
        {
            return;
        }

        if((currentInput.length >= 2) && (currentInput[currentInput.length-1] == " ") && (currentInput[currentInput.length-2] == " "))
        {
           currentInput=currentInput.trim();

           this.props.onNewTag(currentInput);

           this.setState({
               tagInProgress: "",
           });
        }
        
        else
        {
            this.props.onNewTagChanged(currentInput);
            this.setState({
                tagInProgress: currentInput
            });
        }
    }

    onTagInputKeyDown(event)
    {
        if(event.keyCode == 13)
        {
            this.props.onEnter(this.state.tagInProgress);

             this.setState({
               tagInProgress: "",
           });
        }
    }

    onNewTagDefault()
    {
        console.log("override props.onNewTag");
    }

    onEnterDefault()
    {
        console.log("override props.onEnter");
    }

    render()
    {
        var style ={};
        style ={
            display:'flex',
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

        var separator = <FontAwesome name='angle-right' style={{paddingLeft:3, paddingRight:3, opacity:0.4 }}/>

        this.props.hitag.map(function(tag, index, originalArray)
        { 
            hitagChain.push(<div style={{display: 'inline-block'}}> {tag}</div>);

            if(index!= originalArray.length-1)
                 hitagChain.push( separator); 
                       
        });

        var tagInProgress = null;
        var lastSeparator = null;
        if(this.props.inProgress)
        {
            tagInProgress=<input ref= "tagInProgress"
                style={{minWidth:50,
                    width:0,
                    flex: 1,
                    outline:"none",
                    border:"none",
                    WebkitAppearance: "none", 
                    fontFamily: '"Helvetica Neue", "Lucida Grande", sans-serif',
                    fontSize: "100%",
                    padding:0}}

                onChange={this.onTagInputChanged}
                onKeyDown = {this.onTagInputKeyDown}
                value = {this.state.tagInProgress}
                onFocus = {this.onTagInputFocus}
                onBlur = {this.onTagInputBlur}/>

            if(this.props.hitag.length>0)
                lastSeparator = <FontAwesome name='angle-right'style={{paddingLeft:3, paddingRight:3, opacity:0.4 }}/>
        }
        
        return(
            <div style={style}>           
                {hitagChain}
                {lastSeparator}
                {tagInProgress}
            </div>
        );
    }
}
