import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from "./pages/login/login.component";
import { SideBarComponent } from "./layouts/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OnlineExaminationSystem';
}
