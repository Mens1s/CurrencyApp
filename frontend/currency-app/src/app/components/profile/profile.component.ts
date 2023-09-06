import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css','../dashboard/css/sb-admin-2.min.css', '../dashboard/vendor/fontawesome-free/css/all.min.css']
})
export class ProfileComponent implements OnInit {
  public user = new User();
  public transactionNumber = 0;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    if(!this.authService.isLoggedIn()){
      router.navigate([""]);
    }
    
    this.user = userService.getUser();


    if (this.user) {
      this.transactionNumber = this.user.transactions ? this.user.transactions.length : 0;
    } else {
      this.transactionNumber = 0;
    }

    this.user.transactions.sort((a, b) => b.id - a.id);
  }

  ngOnInit(): void {
  }

}
