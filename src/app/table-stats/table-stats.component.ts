import {AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-table-stats',
  templateUrl: './table-stats.component.html',
  styleUrls: ['./table-stats.component.css']
})
export class TableStatsComponent implements AfterViewInit {

  employees:Employee[] = employeesData;
  projects:Project[] = projectsData;

     bestDuoCollection: any = [];
     activeProjectsId:any = [];
     bestDuo: any = {
      projects: 0,
      name1: '',
      name2: ''
    }

  employeesNumber = this.employees.length;
  projectsNumber = this.projects.length;
    nowWorking: any = 0;
  displayedColumns: string[] = ['id', 'name','employeeProjects.project_id',  'employeeProjects.start_work','employeeProjects.end_work'];
  dataSource = new MatTableDataSource<Employee>(this.employees);


  ngAfterViewInit() {

  }


  //Превръща идто на проект в името на дадения проект
  getName(element: any,el:any){
    let result;

      result = this.projects.filter(project => project.id === element);
      return result[0].project_name;
      
  }
// Статистиките:
  checkActive(project:any) {
    let date1 = formatDate(new Date(),'yyyy-MM-dd','en_US');
    let date2 =  formatDate(project.end_date,'yyyy-MM-dd','en_US');

    if(date1<date2){
      this.activeProjectsId.push(project.id);
      return date2;
     }
  }
  ///////////////////////////////////////////

  checkForEmployeesDuo(){
    let currentBest = 0;
    let firstName = '';
    let secondName = '';
    for(let i =0;i < this.employees.length;i++){
      for(let k =1; k< this.employees.length;k++)  {
      this.bestDuo.name1 = this.employees[i].name;
      this.bestDuo.name2 = this.employees[k].name;
      this.bestDuo.projects = 0;

        for(let l = 0;l < this.employees[i].employeeProjects.length; l++){
          for(let g = 0;g < this.employees[k].employeeProjects.length; g++){
            if(this.employees[i].employeeProjects[l].project_id === this.employees[k].employeeProjects[g].project_id){
              this.bestDuo.projects++;
            }
          }
        }
      if(this.bestDuo.name1 !== this.bestDuo.name2 && this.bestDuo.projects > 0){
        this.bestDuoCollection.push({
          projects: this.bestDuo.projects,
          name1: this.bestDuo.name1,
          name2: this.bestDuo.name2
        });
      }
      
      }
    }

    for(let n = 0; n < this.bestDuoCollection.length;n++){
      if(currentBest < this.bestDuoCollection[n].projects){
        firstName = this.bestDuoCollection[n].name1;
        secondName = this.bestDuoCollection[n].name2; 
        currentBest = this.bestDuoCollection[n].projects;
      }
    }
    return `${firstName} & ${secondName}`
  }

  workingNow(project: any) {
    for(let i =0;i < this.activeProjectsId.length;i++){
      if(project.project_id === this.activeProjectsId[i]){
        return true;
      }
    }    
  }

  workingOnMoreThanOne(employee: any){
    for(let i=0;i<employee.employeeProjects.length;i++){
      for(let k=i+1;k<employee.employeeProjects.length;k++){
        let date_end1 = formatDate(employee.employeeProjects[i].end_work,'yyyy-MM-dd','en_US');
        let date_end2 =  formatDate(employee.employeeProjects[k].end_work,'yyyy-MM-dd','en_US');
        let date_start1 = formatDate(employee.employeeProjects[i].start_work,'yyyy-MM-dd','en_US');
        let date_start2 =  formatDate(employee.employeeProjects[k].start_work,'yyyy-MM-dd','en_US');
        if(date_start1 <= date_end2  && date_start2 <= date_end1){
          return true;
        }
      }
    }

  }
}
