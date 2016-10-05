import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Tag extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            hitag: ['empty'],
            inputTag:"",
            encapsulated:true,
            inProgress:false,
            onNewTag:this.onNewTagDefault,
            onEnter:this.onEnterDefault,
            onTagInputChanged:this.onTagInputChangedDefault,
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        var that = this;

        this.onTagInputChangedLocal = this.onTagInputChangedLocal.bind(this);
        this.onTagInputKeyDown = this.onTagInputKeyDown.bind(this);
        this.onTagInputChangedDefault = this.onTagInputChangedDefault.bind(this);
        this.onNewTagDefault = this.onNewTagDefault.bind(this);
        this.onEnterDefault = this.onEnterDefault.bind(this);
    }

    onTagInputChangedDefault(inputTag)
    {
        console.log("Override onTagInputChanged");
    }  

    onTagInputChangedLocal(event)
    {
        var currentInput = event.target.value;

        if((currentInput.length>0) && (currentInput[0]==" "))
        {
            return;
        }

        if((currentInput.length >= 2) && (currentInput[currentInput.length-1] == " ") && (currentInput[currentInput.length-2] == " "))
        {
           this.props.onNewTag(currentInput.trim());
           return;
        }        

        this.props.onTagInputChanged(currentInput);
    }

    onTagInputKeyDown(event)
    {
        if(event.keyCode == 13)
        {
            this.props.onEnter(this.props.inputTag);
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

                onChange={this.onTagInputChangedLocal}
                onKeyDown = {this.onTagInputKeyDown}
                value = {this.props.inputTag}
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
