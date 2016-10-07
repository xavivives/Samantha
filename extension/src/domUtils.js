import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';

export default class DomUtils
{
    static  getElementRect(that, ref)
    {
        var element = ReactDOM.findDOMNode(that.refs[ref]);
        var rects = element.getClientRects();
        return rects[0];
    }

    static inject(reactElement, props, elementToFindId)
    {
        injectTapEventPlugin();
        var elementFound = {};
        if(elementToFindId)
            elementFound = document.getElementById(elementToFindId);
        else
            elementFound = document.body;

        var firstResult = elementFound.children[0];
        var container = document.createElement('div');
        elementFound.insertBefore(container,firstResult);

        var reactElement = React.createElement(reactElement, props);

        ReactDOM.render(reactElement, container);
    }

}
        