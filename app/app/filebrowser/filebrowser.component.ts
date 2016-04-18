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
    classMap = { 'file-type-icon folder': true, 'file-type-icon blank-file': false };
    dataJson: string; 
    media_file_location: string;
    path:string = '';  
    ismedia_selected:boolean = false;
    fileList:String[] = [];
    constructor(private _dataservice:DataService){
        
    }
    getfiletype(filename){
        filename = filename.toLowerCase();
        let arr = filename.split(".");
        let ext = arr[arr.length-1];
        if (arr.length > 1){
            switch (ext) {
            case 'mp4':
                return 'video';
           case 'mp3':
                return 'audio'; 
        }
        return 'unknown';
        }
        else{
            return 'folder'
        }
    }
    getStyle(filename){
        filename = filename.toLowerCase();
        switch (this.getfiletype(filename)) {
            case 'video':
                return 'file-type-icon mp4-file';
            case 'audio':
                return 'file-type-icon mp3-file';
            case 'folder':
                return 'file-type-icon folder';
            case 'unknown':
                return 'file-type-icon blank-file';
            default:
                console.log('error');
                return 'file-type-icon blank-file';
        }
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
                                
                                let file_type = this.getfiletype(data.folder);
                                if (file_type === 'audio' || file_type === 'video')
                                {
                                    this.cast(data.file_location);
                                }
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