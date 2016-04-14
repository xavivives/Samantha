import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import LazyLoad from 'react-lazy-load';
import HtmlMetadata from 'html-metadata';
import DomainUtil from 'tldjs';

export default class searchResultItem extends React.Component
{
    constructor(props)
    {
      super(props);
      this.onClicked = this.onClicked.bind(this);
      console.log("Props");
      console.log(props.result);

      this.urlDomain = DomainUtil.getDomain(props.result.url);
      this.state= {
            imageUrl: null,
            imageHeight:50,
            imageWidth:0
        };

      var that = this;

      HtmlMetadata(props.result.url).then(function(metadata)
        {
            var imageUrl = that.getImageUrl(metadata);
            if(imageUrl)
            {   
                that.setState({imageUrl: imageUrl, imageWidth:1.62 * that.state.imageHeight});
            }
            else
            {
                that.setState({imageWidth: 0 });
            }
            
            console.log(metadata);
            console.log(that.state.imageUrl);
        });
    }

    getImageUrl(metadata)
    {
        if(metadata.openGraph)
        {
            if(metadata.openGraph.image)
            {
                if(metadata.openGraph.image.url)
                {
                    return metadata.openGraph.image.url;
                }

                if(Array.isArray(metadata.openGraph.image))
                {
                     if(metadata.openGraph.image.length>0)
                     {
                        return  metadata.openGraph.image[0];                        
                     }
                }
            }
        }
        console.log("6");
        return null;
    }

    onClicked(result)
    {
      this.setState({open: true});
      this.gotoUrl(result.url);
    }

    gotoUrl(url)
    {
      window.location.href = url;
    }

    render() {
        return (
            <div onClick= {()=>this.onClicked(this.props.result)}  style={{cursor: 'pointer', display: 'flex', paddingBottom:5}}>

                <div style={{flexGrow: 1, paddingRight:10}}>

                    <p style = {{opacity:0.9, marginBottom:"0.5em", marginTop:0}}> 
                        {this.props.result.content}
                    </p>
                    <p style = {{opacity:0.6, marginBottom:"0.5em", marginTop:0}}> 

                        <span style = {{color: 'green'}}>
                            {Math.round(this.props.result.score*100)/100+ " "}
                        </span>

                        {this.urlDomain}

                    </p> 
                </div>
                <LazyLoad height={this.imageHeight} offset={300}>
                    <img style={{objectFit: 'cover', WebkitBorderRadius: 3}}width = {this.state.imageWidth} height = {this.state.imageHeight} src={this.state.imageUrl} />
                </LazyLoad>
            </div>
        );
    }
}