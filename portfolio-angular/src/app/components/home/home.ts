import { Component, HostListener } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Company } from '../company/company';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { MiniGame } from '../mini-game/mini-game';
import { NowPlaying } from '../now-playing/now-playing';

import { EasterEggService } from '../../services/easter-egg.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [Hero, NowPlaying, About, Company, Skills, Projects, MiniGame, Contact],
  templateUrl: './home.html',
})
export class Home {
  private konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private konamiIndex = 0;

  constructor(public easterEgg: EasterEggService, private seo: SeoService) {}

  ngOnInit() {
    this.seo.setStandardMetaAndOpenGraph(
      'Yassoungo Diarrassouba - Développeur Full Stack',
      'Portfolio de Yassoungo Diarrassouba, expert Angular et Laravel. Découvrez mes projets, mon parcours et mon blog !',
      'Assets/images/hero-bg.jpg'
    );
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.easterEgg.isUnlocked()) return;
    
    if (event.key === this.konamiCode[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiCode.length) {
        this.easterEgg.unlock();
      }
    } else {
      this.konamiIndex = 0;
    }
  }
}
