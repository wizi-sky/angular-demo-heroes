import { Component, OnInit } from '@angular/core';
import { Hero } from '../interface/heroes';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(public heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroesList()
      .subscribe(data => {
        this.heroes = data;
        console.log(this.heroes,'dashboard')
      });
  }
}
