import {Component} from 'angular2/core';


@Component({
    selector: 'filebrowser-component',
    template: `<h1>this is file browser component</h1>
<div>{{path}}</div>
<div class='simplestyle'>hello</div>
    `
})

export class FileBrowserComponent { 
    path = '/';
}