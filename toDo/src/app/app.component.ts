import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {NgModule} from '@angular/core';

interface IPerson{ 
  name: String 
};

interface IToDo{
  id: number, 
  desc: String, 
  assignedTo: String, 
  done: boolean
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public toDos: IToDo[];
  public person: IPerson[];
  public filter: number= 0;
  public newDesc: String;
  public newPersonName: String;
  public personName: String;
  
  constructor(private httpClient: HttpClient) { 
    
  }

  ngOnInit() {
    this.loadToDos();
    this.loadPeople();
  }

  async loadToDos(){
    this.toDos = await this.httpClient.get<IToDo[]>('http://localhost:8080/api/todos').toPromise();
    if (this.filter == 2){
      this.toDos = this.toDos.filter(this.checkUndone);
    }
    if (this.filter == 1){
      this.toDos = this.toDos.filter(this.checkDone);
    }
    if (this.personName != ""){
      this.toDos = this.toDos.filter(toDo => toDo.assignedTo == this.personName);
    }
  }

  async loadPeople(){
    this.person = await this.httpClient.get<IPerson[]>('http://localhost:8080/api/people').toPromise();
  }

  async createToDo(){
    await this.httpClient.post('http://localhost:8080/api/todos', {
      "description": this.newDesc,
      "assignedTo": this.newPersonName
    }).toPromise(); 
    this.loadToDos();
  }

  async deleteToDo(id: number){
    await this.httpClient.delete(`http://localhost:8080/api/todos/${id}`).toPromise();
    this.loadToDos();
  }

  public checkUndone(toDo: IToDo){
    return !toDo.done;
  }

  public checkDone(toDo: IToDo){
    return toDo.done;
  }

  printTodos(){
    console.log(this.toDos);
  }
}
