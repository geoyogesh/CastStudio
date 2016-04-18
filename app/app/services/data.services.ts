import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
     constructor(private http:Http){}
    
    getRandomString() {
        return ['list1','list2'];
    }
    
    
    onInitList(path,folder){
        console.log('gettting init list');
        let body = JSON.stringify({
                    path: path, folder: folder
                    });
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post('/api/listfiles',body,options)
            .map(res => res.json())
    }
    
    cast(path){
        console.log('gettting init list');
        let body = JSON.stringify({
                    path: path
                });
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post('/api/cast',body,options)
            .map(res => res.json())
    }
}

