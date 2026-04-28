import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Projects, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home { }
