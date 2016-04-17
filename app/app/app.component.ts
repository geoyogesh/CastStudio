import {Component} from 'angular2/core';
import {FileBrowserComponent} from './filebrowser/filebrowser.component';

@Component({
    selector: 'cast-studio-app',
    template: '<h1>Cast Studio</h1><filebrowser-component></filebrowser-component>',
directives: [FileBrowserComponent]
})
export class AppComponent { 

}
