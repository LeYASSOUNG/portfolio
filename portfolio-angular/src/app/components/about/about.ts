import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
/**
 * Composant À Propos
 * Présente le parcours, la biographie et les compétences secondaires.
 */
export class About {
  constructor(public translation: TranslationService) {}
}
