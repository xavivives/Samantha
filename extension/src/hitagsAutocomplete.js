import React from 'react';
import TextField from 'material-ui/TextField';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';
import HitagUtils from './hitagUtils.js';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
           isOpened :true
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onTagInputKeyDown = this.onTagInputKeyDown.bind(this);
        this.onTagInputFocus = this.onTagInputFocus.bind(this);
        this.onTagInputBlur = this.onTagInputBlur.bind(this);
        this.checkIfDisplayAutocomplete = this.checkIfDisplayAutocomplete.bind(this);
        
        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onListItemSelected = this.onListItemSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);

        this.onAction = this.onAction.bind(this);
        this.onMoveUp = this.onMoveUp.bind(this);
        this.onMoveDown = this.onMoveDown.bind(this);

        this.state = {
            tagInput:"",
            items:[], 
            selectedIndex:0,
            inputHitag:[]
        };

        this.hotKeyshandlers = {
          'action': this.onAction,
          'moveUp': this.onMoveUp,
          'moveDown':this.onMoveDown,
          'moveLeft': this.onMoveUp,
          'moveRight':this.onMoveDown,
        };
    }

    onAction(e)
    {
        console.log("action");
    }

    onMoveUp(e)
    {
        if(this.state.selectedIndex>0)
            this.selectItem(this.state.selectedIndex - 1)
    }
    
    onMoveDown(e)
    {
        if(this.state.selectedIndex< this.state.items.length-1)
            this.selectItem(this.state.selectedIndex + 1)
    }

    onTagInputChanged(event)
    {
        var currentInput = event.target.value;
        var currentHitag = this.state.inputHitag;

        console.log(currentInput.length);
        console.log(currentInput);

        if((currentInput.length>0) && (currentInput[0]==" "))
        {
            console.log("in");
            return;
        }

        if((currentInput.length >= 2) && (currentInput[currentInput.length-1] == " ") && (currentInput[currentInput.length-2] == " "))
        {
           console.log("there");
           currentInput=currentInput.trim();
           currentHitag.push(currentInput);
           this.setState({
               tagInput : "",
               inputHitag : currentHitag
           });
        }
        
        else
        {
             this.setState({
                tagInput : currentInput
            });
        }

        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputKeyDown(event)
    {
        if(event.keyCode == 13)
        {
            var currentInput=this.state.tagInput;
            var currentHitag = this.state.inputHitag;
            currentHitag.push(currentInput.trim());

            var items = this.state.items;
            items.push(this.state.inputHitag);

            this.setState({
                items: items,
                tagInput: "",
                inputHitag: []
            });

            this.checkIfDisplayAutocomplete("", true);
        }
    }

    onTagInputFocus(event)
    {   
        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputBlur(event)
    {
        this.checkIfDisplayAutocomplete(event.target.value, false);
    }

    onListItemSelected(index)
    {
        selectItem(index);
    }

    selectItem(index)
    {
        this.setState({
            selectedIndex:index,
            inputHitag: this.state.items[index],
            tagInput: ""
        })
    }

    checkIfDisplayAutocomplete (tagInputValue, tagInputIsFocused)
    {
        var open = false;

        if(tagInputValue != "" && tagInputIsFocused)
           open = true;

       if(this.state.autocompleteIsOpened != open)
            this.setState({ autocompleteIsOpened:open});
    }

    render()
    {
        var style ={
            display: 'flex',
            flexWrap:'nowrap',
            flexDirection:'row'
        };

        var children = []

        this.state.items.map(function(item, index)
        {
            children.push(<Hitag hitag={item}/>);
        });

        return(
            <HotKeys  style = {{outline:'none'}} handlers = {this.hotKeyshandlers} >

                <div style={style}> 
                    <Hitag style={{flex:1}} encapsulated = {false} hitag ={this.state.inputHitag}/>
                    <input
                        style={{minWidth:10, flex:1}}
                        hintText="Add tags..."
                        onChange={this.onTagInputChanged}
                        onKeyDown = {this.onTagInputKeyDown}
                        fullWidth={true}
                        value = {this.state.tagInput}
                        onFocus = {this.onTagInputFocus}
                        onBlur = {this.onTagInputBlur}/>
                </div>

                <SelectableList asList= {true} children = {children} encapsulated = {false} selectedIndex = {this.state.selectedIndex} onItemSelected = {this.onListItemSelected}/> 
            </HotKeys>             
        ); 
    }
}
//