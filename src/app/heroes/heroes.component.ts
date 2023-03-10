import { Hero } from './../interface/heroes';
import { MessageComponent } from './../message/message.component';
import { Component, OnInit } from '@angular/core';
import { HEROES } from '../mock/heroes.mock';
import { HeroService } from '../services/hero.service';



@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  // hero: Hero = {
  //   id: 8,
  //   name: "紫衫"
  // }
  // ?:是指可选参数，可以理解为参数自动加上undefined
  // selectedHero?: Hero;
  heroes: Hero[] = [];

  // 注入服务
  constructor(public HeroService: HeroService) { }

  ngOnInit(): void {

    this.getList();
  }


  // 获取数据
  getList(): void {
    // 正式开发中可能存在Observable类方式返回数据,通过subscribe订阅获取数据
    this.HeroService.getHeroesList().subscribe(data => {
      this.heroes = data;
    });

    // 直接获取,因为模拟数据getHerosList是直接return的数据
    // this.heroes = this.HeroService.getHeroesList()
  }

  // 添加英雄
  add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.HeroService.addHero({ name } as Hero).subscribe(data => {
      this.heroes.push(data)
    })
  }

  // 删除英雄
  delete(hero: Hero): void {
    console.log("handleDelBtn")
    this.heroes=this.heroes.filter(h => hero.id != h.id);
    this.HeroService.delHero(hero.id).subscribe()
  }

  // selectHero(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.HeroService.sendMessage(hero.name)
  // }

  // 父组件监听到子组件自定义事件之后的处理函数
  // childClick(hero: Hero): void {
  //   console.log(hero, '00000');
  //   alert(hero.name)
  // }

}
