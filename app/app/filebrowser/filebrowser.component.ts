import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {DataService} from "../services/data.services";


@Component({
    selector: 'filebrowser-component',
    templateUrl: 'app/filebrowser/filebrowser.template.html',
    styleUrls: ['app/filebrowser/style.css'],
    directives: [],
    providers: [DataService]
})

export class FileBrowserComponent implements OnInit {
    dataJson: string; 
    media_file_location: string;
    path:string = '';  
    ismedia_selected:boolean = false;
    fileList:String[] = [];
    constructor(private _dataservice:DataService){
        
    }
    fileSelectionChanged(evt){
        console.log(evt);
        console.log('file selection changed');
        this._dataservice.onInitList(this.path,evt).subscribe(data => 
                        {
                            this.dataJson = JSON.stringify(data);
                            console.log('data received');
                            this.path = data.path;
                            if (data.exist === true && data.isfolder === true) {
                                
                                this.fileList = data.files; 
                                this.ismedia_selected == false;  
                            }
                            else if(data.exist === true && data.isfolder === false) {
                                this.ismedia_selected == true; 
                                this.media_file_location = data.file_location;
                                this.cast(data.file_location);
                            }
                        }, 
                        error => alert(error), () => console.log('finished'));
    }
    cast(path){
        console.log('casting');
        this._dataservice.cast(path).subscribe(data => 
                        {
                            this.dataJson = JSON.stringify(data);
                        }, 
                        error => alert(error), () => console.log('finished'));
    }
    
    
    ngOnInit(): any {
        this.path = '';
        this.fileSelectionChanged('');
    }
}