import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', './css/sb-admin-2.min.css', './vendor/fontawesome-free/css/all.min.css']
})
export class AdminComponent implements OnInit {
  public  updateStatus: string | null = null;
 
  public users: User[]= [];
  public editMode: boolean[] = []; // Array to track edit mode for each row

  constructor(private userService: UserService, private router : Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.userService.getUpdateStatus().subscribe((updateStatus) => {
      this.updateStatus = updateStatus;
      this.loadUsers();
    })
    this.userService.checkLoginStatus();
    const user = this.userService.getUser();


    if( !this.authService.isLoggedIn() || (user.username != "mens1s"))
      this.router.navigate([""]);
    
    this.loadUsers();

  }

  private loadUsers(){
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.editMode = Array(this.users.length).fill(false);
      },
      (error) => {
        console.error("error fetching users: ", error);
      }
    )
  }
  
  public toggleEditMode(index:number){
    this.editMode[index] = !this.editMode[index];
  }

  public saveChanges(index: number, user: User){
 
    this.userService.updateUserDB(user.username, user);

    this.editMode[index] = false;
  }
  
  public deleteUser(username: String){
    const isConfirmed = window.confirm(`${username} adlı kullanıcıyı silmek istediğine emin misin?`);

    if (isConfirmed) {
      this.userService.deleteUser(username);
    }
  }

  public goToMainPage(){
    this.router.navigate(["/"])
  }
}
