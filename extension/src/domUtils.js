import ReactDom from 'react-dom';

export default class DomUtils
{
    static  getElementRect(that, ref)
    {
        var element = ReactDom.findDOMNode(that.refs[ref]);
        var rects = element.getClientRects();
        return rects[0];
    }
}
        