import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, Navbar, Footer],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {}
