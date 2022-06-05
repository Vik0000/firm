import {AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { formatDate} from '@angular/common';
import * as _ from 'lodash';


import employeesData from '../../assets/employees.json'
import projectsData from '../../assets/projects.json'
import { _isNumberValue } from '@angular/cdk/coercion';

export interface Projects {
  project_id: String;
  start_work: String;
  end_work: String;
}

export interface Employee {  
  id: Number;  
  name: String; 
  employeeProjects: Projects[];

} 

export interface Project {  
  id: String;   
  project_name: String;  
  start_date: String; 
  end_date: String;   
}   


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})




export class TableComponent implements AfterViewInit {

  employees:Employee[] = employeesData;
  projects:Project[] = projectsData;
  startWork:any;
  endWork:any;
  curProject:any;
  changedProjectEmployeeId: any = {
    project_id:"000",
    newStartWork:'Yes',
    newEndWork: 'Yes',
    selectedId: 0};

    nowWorking: any = 0;
  displayedColumns: string[] = ['id', 'name','employeeProjects.project_id',  'employeeProjects.start_work','employeeProjects.end_work'];
  dataSource = new MatTableDataSource<Employee>(this.employees);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

// Сортиране :
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'employeeProjects.start_work': {
          if(this.changedProjectEmployeeId.selectedId === item.id){
            return this.changedProjectEmployeeId.newStartWork
          }
          return item.employeeProjects[0].start_work; // Сортиране на дата
        }
        case 'employeeProjects.end_work':{
          if(this.changedProjectEmployeeId.selectedId === item.id){
            return this.changedProjectEmployeeId.newEndWork
          }          
          return item.employeeProjects[0].end_work; // Сортиране на дата
        } 
        case 'employeeProjects.project_id':{
          if(this.changedProjectEmployeeId.selectedId === item.id){
            return this.getName(this.changedProjectEmployeeId.project_id,"");
          }
          return this.getName(item.employeeProjects[0].project_id,""); // Сортиране на проектите по азбучен ред 
        } 
        default: return item[property];      
    }; 
}
this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  //Превръща идто на проект в името на дадения проект
  getName(element: any,el:any){
    let result;

      result = this.projects.filter(project => project.id === element);
      return result[0].project_name;
      
  }
  changeProject(value: any,el:any){
    let result = el.employeeProjects.filter(proj => proj.project_id === value);
    this.changedProjectEmployeeId = {
      project_id:result[0].project_id,
      newStartWork: result[0].start_work,
      newEndWork: result[0].end_work,
      selectedId: el.id};
  
  }

  // Извличане на дата на започване по проект 
  getStartWork(element: any,check: any){
    

    let results = element.employeeProjects.filter(proj => proj);
    let view : any;
    for(let result of results){   
      if(result.project_id === this.changedProjectEmployeeId.project_id && element.id ===this.changedProjectEmployeeId.selectedId ){        
        view = true;
        break;
      }else {              
        view = false;
      }
    }
    if  (view){
      this.startWork = this.changedProjectEmployeeId.newStartWork;
    }else{
      this.startWork = element.employeeProjects[0].start_work ;
    }
    return this.startWork;
  }
// Извличане на дата на излизане от проект
  getEndWork(element: any,check: any){

    let results = element.employeeProjects.filter(proj => proj);
    let view : any;
    for(let result of results){
     
      if(result.project_id === this.changedProjectEmployeeId.project_id && element.id ===this.changedProjectEmployeeId.selectedId ){        
        view = true;
        break;
      }else {              
        view = false;
      }
    }
    if  (view){
      this.endWork = this.changedProjectEmployeeId.newEndWork;
    }else{

      this.endWork = element.employeeProjects[0].end_work ;
    }
    return this.endWork;
  }
// Извличане на проектите
  getProject(element: any, el:any) {
  let results = el.employeeProjects.filter(proj => proj);
  let view : any;
  for(let result of results){   
    if(result.project_id === this.changedProjectEmployeeId.project_id && el.id ===this.changedProjectEmployeeId.selectedId ){        
      view = true;
      break;
    }else {              
      view = false;
    }
  }
  if  (view){
    this.curProject = this.changedProjectEmployeeId.project_id;
  }else{
    this.curProject = el.employeeProjects[0].project_id ;
  }
  return this.curProject ;
  }


}
